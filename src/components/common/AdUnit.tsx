"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit() {
  const adRef = useRef<HTMLModElement>(null); // ✅ 修正：insタグに適した型
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && typeof window !== "undefined") {
      try {
        if (window.adsbygoogle && adRef.current) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div style={{ width: "300px", height: "250px" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "300px", height: "250px" }}
        data-ad-client="ca-pub-6887407803306740"
        data-ad-slot="3186493931"
        data-ad-format=""
        // data-full-width-responsive="true"
      />
    </div>
  );
}
