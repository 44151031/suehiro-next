// src/lib/sessionClient.ts
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "paycan_session_id";

export function getOrSetSessionId(): string {
  if (typeof window === "undefined") return ""; // SSRガード

  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}
