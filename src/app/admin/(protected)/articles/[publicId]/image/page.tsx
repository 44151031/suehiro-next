"use client";

import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { supabaseClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function ArticleImagePage() {
  const { publicId } = useParams<{ publicId: string }>();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // 初期表示：DBから現在の画像を取得
  useEffect(() => {
    async function fetchCurrentImage() {
      const { data, error } = await supabaseClient
        .from("articles")
        .select("hero_image_url")
        .eq("public_id", publicId)
        .single();

      if (!error && data?.hero_image_url) {
        setCurrentImage(data.hero_image_url);
      }
    }
    fetchCurrentImage();
  }, [publicId]);

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setMsg(null);

      const file = acceptedFiles[0];
      if (!file) return;

      // プレビュー用にURL生成
      setPreview(URL.createObjectURL(file));

      // 古い拡張子違いを削除
      await supabaseClient.storage.from("articles-public").remove([
        `${publicId}.jpg`,
        `${publicId}.jpeg`,
        `${publicId}.png`,
        `${publicId}.webp`,
      ]);

      // 新しい拡張子で保存（※フォルダ名は不要）
      const ext = file.name.split(".").pop();
      const filePath = `${publicId}.${ext}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("articles-public")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // 公開URLを取得
      const { data } = supabaseClient.storage
        .from("articles-public")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;


      // DBを更新
      const { error: dbError } = await supabaseClient
        .from("articles")
        .update({ hero_image_url: imageUrl })
        .eq("public_id", publicId);

      if (dbError) throw dbError;

      setMsg("アップロード完了！（古い画像は削除済み）");
      setCurrentImage(imageUrl); // DB更新後、最新画像を反映
    } catch (err: any) {
      setMsg("エラー: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">HERO画像の編集</h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>ここにドロップしてください</p>
        ) : (
          <p>画像をドラッグ＆ドロップ、またはクリックして選択</p>
        )}
      </div>

      {uploading && <p className="mt-4 text-gray-500">アップロード中...</p>}
      {msg && <p className="mt-4">{msg}</p>}

      {/* 既存画像がある場合 */}
      {currentImage && !preview && (
        <div className="mt-6">
          <p className="mb-2 text-gray-600">現在の画像</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt="current hero"
            className="max-h-64 rounded shadow"
          />
        </div>
      )}

      {/* 新規アップロードプレビュー */}
      {preview && (
        <div className="mt-6">
          <p className="mb-2 text-gray-600">新しいプレビュー</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="max-h-64 rounded shadow" />
        </div>
      )}
    </div>
  );
}
