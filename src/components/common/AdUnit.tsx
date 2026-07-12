"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdUnitProps = {
  responsive?: boolean;
  placement?: string;
};

export default function AdUnit({
  responsive = false,
  placement = "standard",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null); // ✅ 修正：insタグに適した型
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && typeof window !== "undefined") {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div
      className="flex justify-center items-center my-8 w-full min-h-[250px]"
      data-ad-placement={placement}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={
          responsive
            ? { display: "block", width: "100%", minHeight: "250px" }
            : { display: "block", width: "300px", height: "250px" }
        }
        data-ad-client="ca-pub-6887407803306740"
        data-ad-slot="3186493931"
        data-ad-format={responsive ? "auto" : ""}
        data-full-width-responsive={responsive ? "true" : undefined}
      />
    </div>
  );
}
