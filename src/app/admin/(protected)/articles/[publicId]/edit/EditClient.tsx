"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";
import type { Article } from "./page";
import FormInput from "@/components/common/forms/FormInput";
import FormTextarea from "@/components/common/forms/FormTextarea";

type Form = {
  title: string;
  dek: string;
  slug: string;
  body_md: string;
};

function buildPublicPath(slug: string, published_at?: string | null) {
  const d = published_at ? new Date(published_at) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `/articles/${y}/${m}/${slug}`;
}

export default function EditClient({ initial }: { initial: Article }) {
  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: {
      title: initial.title ?? "",
      dek: initial.dek ?? "",
      slug: initial.slug ?? "",
      body_md: initial.body_md ?? "",
    },
  });
  const [busy, setBusy] = useState(false);

  async function validateSlugUnique(slug: string) {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .neq("id", initial.id);
    if (error) {
      alert(error.message);
      return false;
    }
    if ((data ?? []).length > 0) {
      alert("この slug は既に使われています。別の値にしてください。");
      return false;
    }
    return true;
  }

  async function callRevalidate(path: string) {
    try {
      await fetch("/api/admin/revalidate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    } catch {
      // 開発時は握りつぶす
    }
  }

  async function save(v: Form) {
    setBusy(true);
    try {
      if (!(await validateSlugUnique(v.slug))) return;

      const { error } = await supabaseClient
        .from("articles")
        .update({
          title: v.title,
          dek: v.dek || null,
          slug: v.slug,
          body_md: v.body_md,
          updated_at: new Date().toISOString(),
        })
        .eq("id", initial.id);

      if (error) throw error;

      if (initial.status === "published") {
        const path = buildPublicPath(v.slug, initial.published_at);
        await callRevalidate(path);
      }

      alert("保存しました");
    } catch (e: any) {
      alert(e?.message ?? "保存に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    try {
      const slug = watch("slug");
      if (!(await validateSlugUnique(slug))) return;

      const oldPath =
        initial.status === "published"
          ? buildPublicPath(initial.slug, initial.published_at)
          : null;

      const nowIso = new Date().toISOString();

      const { error } = await supabaseClient
        .from("articles")
        .update({
          title: watch("title"),
          dek: watch("dek") || null,
          slug,
          body_md: watch("body_md"),
          status: "published",
          published_at: initial.published_at ?? nowIso,
          updated_at: nowIso,
        })
        .eq("id", initial.id);

      if (error) throw error;

      const newPath = buildPublicPath(slug, initial.published_at ?? nowIso);
      if (oldPath && oldPath !== newPath) {
        await callRevalidate(oldPath);
      }
      await callRevalidate(newPath);

      alert("公開しました");
    } catch (e: any) {
      alert(e?.message ?? "公開に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function unpublish() {
    if (!confirm("この記事を非公開（draft）にしますか？")) return;
    setBusy(true);
    try {
      const nowIso = new Date().toISOString();
      const { error } = await supabaseClient
        .from("articles")
        .update({
          status: "draft",
          published_at: null,
          updated_at: nowIso,
        })
        .eq("id", initial.id);

      if (error) throw error;

      if (initial.status === "published") {
        const path = buildPublicPath(initial.slug, initial.published_at);
        await callRevalidate(path);
      }

      alert("非公開にしました");
    } catch (e: any) {
      alert(e?.message ?? "非公開に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  const statusLabel =
    initial.status === "published"
      ? "公開中"
      : initial.status === "draft"
      ? "下書き"
      : initial.status;

  const publishedAtLabel = initial.published_at
    ? new Date(initial.published_at).toLocaleString("ja-JP")
    : "-";

  const updatedAtLabel = initial.updated_at
    ? new Date(initial.updated_at).toLocaleString("ja-JP")
    : "-";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex flex-wrap items-center gap-4">
          Edit #{initial.public_id}
          <span className="text-sm text-gray-600">
            ステータス: <span className="font-medium">{statusLabel}</span> / 公開日時:{" "}
            {publishedAtLabel} / 最終更新: {updatedAtLabel}
          </span>
        </h1>
        <Link href="/admin/articles" className="underline">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit(save)} className="grid gap-5 max-w-4xl">
        <FormInput
          label="タイトル"
          placeholder="記事タイトル"
          {...register("title", { required: true })}
        />

        <FormInput
          label="ディスク（概要）"
          placeholder="記事の概要（任意）"
          {...register("dek")}
        />

        <FormInput
          label="スラグ"
          placeholder="例: my-article-slug"
          {...register("slug", { required: true })}
        />

        <FormTextarea
          label="内容（Markdown）"
          placeholder="記事本文をMarkdownで入力"
          className="min-h-[320px]"
          {...register("body_md", { required: true })}
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            disabled={busy}
            className="bg-gray-900 text-white rounded px-4 py-2"
          >
            {busy ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={publish}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            公開
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={unpublish}
            className="border border-gray-400 text-gray-800 rounded px-4 py-2 hover:bg-gray-100"
          >
            非公開
          </button>
        </div>

        {/* 現在の画像プレビュー */}
        {initial.hero_image_url && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">現在の画像</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initial.hero_image_url}
              alt="現在の画像"
              className="w-32 h-auto rounded border shadow"
            />
          </div>
        )}
      </form>
    </div>
  );
}
