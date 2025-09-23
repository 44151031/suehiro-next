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

  // 🔧 OGP用に1200x630 jpgに変換する関数
  const resizeImageToOGP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));

        canvas.width = 1200;
        canvas.height = 630;

        // cover風にトリミングして描画
        const aspect = img.width / img.height;
        const targetAspect = 1200 / 630;

        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (aspect > targetAspect) {
          // 横長 → 横をカット
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
        } else {
          // 縦長 → 縦をカット
          sh = img.width / targetAspect;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1200, 630);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas toBlob failed"));
          },
          "image/jpeg",
          0.7 // 品質70%
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setMsg(null);

      const file = acceptedFiles[0];
      if (!file) return;

      // プレビュー表示用
      setPreview(URL.createObjectURL(file));

      // OGP用に変換
      const blob = await resizeImageToOGP(file);
      const ogpFile = new File([blob], `${publicId}.jpg`, { type: "image/jpeg" });

      // 古い画像を削除
      await supabaseClient.storage.from("articles-public").remove([
        `${publicId}.jpg`,
        `${publicId}.jpeg`,
        `${publicId}.png`,
        `${publicId}.webp`,
      ]);

      // 新しいjpgで保存
      const filePath = `${publicId}.jpg`;
      const { error: uploadError } = await supabaseClient.storage
        .from("articles-public")
        .upload(filePath, ogpFile, {
          upsert: true,
          contentType: "image/jpeg",
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

      setMsg("アップロード完了！（1200x630 jpgに変換済み）");
      setCurrentImage(imageUrl);
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

      {/* 既存画像 */}
      {currentImage && !preview && (
        <div className="mt-6">
          <p className="mb-2 text-gray-600">現在の画像</p>
          <img
            src={currentImage}
            alt="current hero"
            className="max-h-64 rounded shadow"
          />
        </div>
      )}

      {/* 新規プレビュー */}
      {preview && (
        <div className="mt-6">
          <p className="mb-2 text-gray-600">新しいプレビュー（変換前の元画像）</p>
          <img src={preview} alt="preview" className="max-h-64 rounded shadow" />
        </div>
      )}
    </div>
  );
}
