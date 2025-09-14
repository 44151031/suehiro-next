// src/app/api/admin/revalidate-article/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClientServer } from "@/lib/supabase/server";

/**
 * POST /api/admin/revalidate-article
 * Body:
 *   - path?: string               // 再検証したい単一パス（例: /articles/2025/09/foo）
 *   - paths?: string[]            // 複数パス
 *   - includeDefaults?: boolean   // デフォルト（"/", "/articles"）も含めるか（省略時 true）
 */
export async function POST(req: Request) {
  try {
    // --- 管理者チェック（middleware の Basic 認証とは別レイヤー）---
    if (process.env.NEXT_PUBLIC_SKIP_ADMIN_CHECK !== "true") {
      const supabase = await createClientServer();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }

      const { data: me, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !me?.is_admin) {
        return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
      }
    }

    // --- 入力のパース ---
    const body = await safeJson(req);
    const includeDefaults: boolean =
      body?.includeDefaults === undefined ? true : Boolean(body.includeDefaults);

    // ユーザー指定のパスを配列化
    const userPaths: string[] = normalizeToArray(body?.paths ?? body?.path);

    // 既定でトップ/一覧も再検証（任意でオフにできる）
    const defaultPaths = includeDefaults ? ["/", "/articles"] : [];

    // すべてマージしてユニーク化・整形
    const targets = unique(
      [...defaultPaths, ...userPaths]
        .filter(Boolean)
        .map(normalizePath)
        .filter(isValidPath)
    );

    if (targets.length === 0) {
      return NextResponse.json(
        { ok: false, error: "no valid paths" },
        { status: 400 }
      );
    }

    // --- 実行 ---
    for (const p of targets) {
      revalidatePath(p);
    }

    return NextResponse.json({ ok: true, revalidated: targets });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}

/* ---------------------- ユーティリティ ---------------------- */

// 失敗しても落ちない JSON パーサ
async function safeJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

// string | string[] | undefined を string[] に寄せる
function normalizeToArray(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as string[];
  if (typeof input === "string") return [input];
  return [];
}

// 先頭に必ず "/" を付与し、末尾の不要な "/" を除去（ルート "/" は除外）
function normalizePath(p: string) {
  let s = p.trim();
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

// 雑な妥当性チェック（アプリ内パスのみを許可）
function isValidPath(p: string) {
  // 外部URLや疑わしい文字列は弾く
  if (p.startsWith("http://") || p.startsWith("https://")) return false;
  if (p.includes("\n") || p.includes("\r")) return false;
  return p.startsWith("/");
}

// ユニーク化
function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
