// src/app/admin/articles/[publicId]/edit/EditClient.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";
import UploadImage from "@/components/common/forms/UploadImage";
import type { Article } from "./page";

type Form = {
  title: string;
  dek: string;
  slug: string;
  body_md: string;
  hero_image_url: string;
  og_image_url: string;
};

function buildPublicPath(slug: string, published_at?: string | null) {
  const d = published_at ? new Date(published_at) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `/articles/${y}/${m}/${slug}`;
}

export default function EditClient({ initial }: { initial: Article }) {
  const { register, handleSubmit, watch, setValue } = useForm<Form>({
    defaultValues: {
      title: initial.title ?? "",
      dek: initial.dek ?? "",
      slug: initial.slug ?? "",
      body_md: initial.body_md ?? "",
      hero_image_url: initial.hero_image_url ?? "",
      og_image_url: initial.og_image_url ?? "",
    },
  });
  const [busy, setBusy] = useState(false);

  async function validateSlugUnique(slug: string) {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .neq("id", initial.id); // 自分以外
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
      // 開発時はネットワーク失敗があっても致命ではないので握りつぶす
    }
  }

  async function save(v: Form) {
    setBusy(true);
    try {
      // slug重複チェック
      if (!(await validateSlugUnique(v.slug))) return;

      const { error } = await supabaseClient
        .from("articles")
        .update({
          title: v.title,
          dek: v.dek || null,
          slug: v.slug,
          body_md: v.body_md,
          hero_image_url: v.hero_image_url || null,
          og_image_url: v.og_image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", initial.id);

      if (error) throw error;

      // 公開中ならページを再検証
      if (initial.status === "published") {
        const path = buildPublicPath(v.slug, initial.published_at);
        await callRevalidate(path);
      }

      alert("Saved");
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    try {
      const slug = watch("slug");
      if (!(await validateSlugUnique(slug))) return;

      // 旧パス（すでにpublishedだった場合）を退避
      const oldPath =
        initial.status === "published"
          ? buildPublicPath(initial.slug, initial.published_at)
          : null;

      // published_at は未設定なら now を入れる
      const nowIso = new Date().toISOString();

      const { error } = await supabaseClient
        .from("articles")
        .update({
          title: watch("title"),
          dek: watch("dek") || null,
          slug,
          body_md: watch("body_md"),
          hero_image_url: watch("hero_image_url") || null,
          og_image_url: watch("og_image_url") || null,
          status: "published",
          published_at: initial.published_at ?? nowIso,
          updated_at: nowIso,
        })
        .eq("id", initial.id);

      if (error) throw error;

      // 新しい公開ページを再検証
      const newPath = buildPublicPath(slug, initial.published_at ?? nowIso);
      if (oldPath && oldPath !== newPath) {
        await callRevalidate(oldPath); // 旧URLを無効化（404化）
      }
      await callRevalidate(newPath);

      alert("Published");
    } catch (e: any) {
      alert(e?.message ?? "Publish failed");
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

      // 公開中だったページを再検証（即404へ）
      if (initial.status === "published") {
        const path = buildPublicPath(initial.slug, initial.published_at);
        await callRevalidate(path);
      }

      alert("Unpublished");
    } catch (e: any) {
      alert(e?.message ?? "Unpublish failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit #{initial.public_id}</h1>
        <Link href="/admin/articles" className="underline">Back</Link>
      </div>

      <form onSubmit={handleSubmit(save)} className="grid gap-3 max-w-3xl">
        <input className="border p-2 rounded" placeholder="Title" {...register("title", { required: true })} />
        <input className="border p-2 rounded" placeholder="Dek" {...register("dek")} />
        <input className="border p-2 rounded" placeholder="Slug" {...register("slug", { required: true })} />
        <textarea className="border p-2 rounded min-h-[220px]" placeholder="Body (Markdown)" {...register("body_md", { required: true })} />

        <UploadImage
          label="Hero image URL (>=1200px)"
          value={watch("hero_image_url")}
          onChange={(url) => setValue("hero_image_url", url ?? "")}
        />
        <UploadImage
          label="OGP image URL (1200×630)"
          value={watch("og_image_url")}
          onChange={(url) => setValue("og_image_url", url ?? "")}
        />

        <div className="flex items-center gap-3 pt-2">
          <button disabled={busy} className="bg-gray-900 text-white rounded px-4 py-2">
            {busy ? "Saving..." : "Save"}
          </button>
          <button type="button" disabled={busy} onClick={publish} className="bg-gray-800 text-white rounded px-4 py-2">
            Publish
          </button>
          <button type="button" disabled={busy} onClick={unpublish} className="border border-gray-300 text-gray-800 rounded px-4 py-2">
            Unpublish
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Status: <span className="font-medium">{initial.status}</span>{" / "}
          Published at: {initial.published_at ? new Date(initial.published_at).toLocaleString("ja-JP") : "-"}
        </p>
      </form>
    </div>
  );
}
