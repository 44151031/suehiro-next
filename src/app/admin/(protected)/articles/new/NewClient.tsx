"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import FormInput from "@/components/common/forms/FormInput";
import FormTextarea from "@/components/common/forms/FormTextarea";

type Form = {
  title: string;
  dek: string;
  slug: string;
  body_md: string;
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
        status: "draft", // ✅ 新規は必ず下書き
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabaseClient
        .from("articles")
        .insert(payload)
        .select("public_id")
        .single();

      if (error) throw error;

      alert("記事を作成しました");
      router.replace(`/admin/articles/${data!.public_id}/edit`);
    } catch (e: any) {
      alert(e?.message ?? "エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  const viewSlug = watch("slug");

  return (
    <div className="p-6 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">新規記事作成</h1>
      </div>

      {/* フォーム本体 */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 max-w-4xl">
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

        {/* ボタン */}
        <div className="flex items-center gap-3 pt-2">
          <button
            disabled={busy}
            className="bg-gray-900 text-white rounded px-4 py-2"
          >
            {busy ? "作成中..." : "作成"}
          </button>
        </div>

        {/* プレビューURL例 */}
        <p className="text-sm text-gray-500">
          プレビューURL例:{" "}
          <code>/articles/2025/11/{viewSlug || "slug"}</code>
        </p>
      </form>
    </div>
  );
}
