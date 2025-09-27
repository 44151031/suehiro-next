import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export function getOrSetSessionId(): string {
  const store = cookies();
  const key = "paycan_sid";

  let sid = store.get(key)?.value;
  if (!sid) {
    sid = randomUUID();
    // Cookie に保存（半年くらい持たせる）
    store.set(key, sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 180, // 180日
    });
  }
  return sid;
}
