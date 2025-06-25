// ✅ /src/components/common/ClientNoIndex.tsx
"use client";

import { useEffect } from "react";

export default function ClientNoIndex() {
  useEffect(() => {
    const shouldNoIndex =
      document.cookie.includes("x-noindex=true") || location.hostname.endsWith(".vercel.app");

    if (shouldNoIndex && !document.querySelector('meta[name="robots"]')) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex";
      document.head.appendChild(meta);
    }
  }, []);

  return null;
}
