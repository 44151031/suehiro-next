"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Form = {
  title: string;
  dek: string;
  slug: string;
  body_md: string;
  hero_image_url: string;
  og_image_url: string;
  status: "draft" | "published" | "scheduled" | "archived";
};

export default function NewClient({ authorId }: { authorId: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, watch } = useForm<Form>({
    defaultValues: {
      title: "",
      dek: "",
      slug: "",
      body_md: "",
      hero_image_url: "",
      og_image_url: "",
      status: "draft",
    },
  });

  async function validateSlugUnique(slug: string) {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .limit(1);
    if (error) {
      alert(error.message);
      return false;
    }
    if (data && data.length) {
      alert("この slug は既に使われています。別の値にしてください。");
      return false;
    }
    return true;
  }

  const onSubmit = async (values: Form) => {
    setBusy(true);
    try {
      if (!(await validateSlugUnique(values.slug))) return;

      const now = new Date().toISOString();
      const payload: any = {
        author_id: authorId,
        title: values.title,
        dek: values.dek || null,
        slug: values.slug,
        body_md: values.body_md,
        hero_image_url: values.hero_image_url || null,
        og_image_url: values.og_image_url || null,
        status: values.status,
        created_at: now,
        updated_at: now,
      };
      if (values.status === "published") payload.published_at = now;

      const { data, error } = await supabaseClient
        .from("articles")
        .insert(payload)
        .select("public_id")
        .single();

      if (error) throw error;

      alert("Created");
      router.replace(`/admin/articles/${data!.public_id}/edit`);
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  };

  const viewSlug = watch("slug");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-3">
      <label className="text-sm text-gray-700">Title</label>
      <input
        {...register("title", { required: true })}
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">Dek（導入）</label>
      <input
        {...register("dek")}
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">Slug</label>
      <input
        {...register("slug", { required: true })}
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">Body (Markdown)</label>
      <textarea
        {...register("body_md", { required: true })}
        className="min-h-[240px] rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">Hero image URL (>=1200px)</label>
      <input
        {...register("hero_image_url")}
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">OGP image URL (1200×630)</label>
      <input
        {...register("og_image_url")}
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <label className="text-sm text-gray-700">Status</label>
      <select
        {...register("status")}
        className="rounded-lg border border-gray-300 px-3 py-2"
      >
        <option value="draft">draft</option>
        <option value="published">published</option>
        <option value="scheduled">scheduled</option>
        <option value="archived">archived</option>
      </select>

      <div className="mt-2 flex items-center gap-3">
        <button
          disabled={busy}
          className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
        >
          {busy ? "Saving..." : "Create"}
        </button>
        <span className="text-sm text-gray-500">
          プレビューURL例: <code>/articles/2025/11/{viewSlug || "slug"}</code>
        </span>
      </div>
    </form>
  );
}
