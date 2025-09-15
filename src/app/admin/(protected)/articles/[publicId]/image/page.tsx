"use client";

import { useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function ArticleImagePage() {
  const { publicId } = useParams<{ publicId: string }>();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setMsg(null);

      const file = acceptedFiles[0];
      if (!file) return;

      // プレビュー用にURL生成
      setPreview(URL.createObjectURL(file));

      // 保存先: articles-public/{publicId}.jpg
      const filePath = `articles-public/${publicId}.jpg`;

      const { error: uploadError } = await supabaseClient.storage
        .from("articles-public")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 公開URLを取得
      const { data } = supabaseClient.storage
        .from("articles-public")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      // DBを更新（publicIdで更新）
      const { error: dbError } = await supabaseClient
        .from("articles")
        .update({ hero_image_url: imageUrl })
        .eq("public_id", publicId);

      if (dbError) throw dbError;

      setMsg("アップロード完了！");
    } catch (err: any) {
      setMsg("エラー: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">HERO画像の編集</h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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

      {preview && (
        <div className="mt-6">
          <p className="mb-2 text-gray-600">プレビュー</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="max-h-64 rounded shadow" />
        </div>
      )}
    </div>
  );
}
