// src/components/forms/UploadImage.tsx
"use client";
import React from "react";

type Props = {
  value?: string | null;
  onChange?: (url: string | null) => void;
  label?: string;
};

export default function UploadImage({ value, onChange, label = "Image" }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700">{label}</label>
      <div className="border rounded p-3 text-sm text-gray-500">
        （後で実装：画像アップロードUI / 現在値: {value ?? "なし"}）
      </div>
    </div>
  );
}
