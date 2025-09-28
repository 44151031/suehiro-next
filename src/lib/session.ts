import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getOrSetSessionId(): Promise<string> {
  const store = await cookies(); // ← await 必須
  const key = "paycan_sid";

  let sid = store.get(key)?.value;
  if (!sid) {
    sid = randomUUID();
    store.set({
      name: key,
      value: sid,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 180, // 180日
      path: "/",
    });
  }
  return sid;
}
