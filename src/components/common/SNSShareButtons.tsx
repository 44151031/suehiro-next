"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type Props = {
  url: string;
  title: string;
  hashtags?: string[];
};

export function SNSShareButtons({ url, title, hashtags = [] }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [isMobileShare, setIsMobileShare] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const ua = navigator.userAgent.toLowerCase();
    const isSmartphone =
      /iphone|ipod|android.*mobile|windows.*phone/.test(ua);
    const supportsWebShare = !!navigator.share;

    setIsMobileShare(isSmartphone && supportsWebShare);
  }, []);

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          url,
        })
        .catch((err) => {
          console.error("Share failed:", err);
        });
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedHashtags = encodeURIComponent(hashtags.join(","));

  return (
    <div className="mt-6 flex justify-center gap-2">
      {isClient &&
        (isMobileShare ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="text-gray-800 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-md font-semibold px-5 py-2"
          >
            <Share2 className="w-4 h-4 mr-1" />
            共有する
          </Button>
        ) : (
          <>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-[#00C300] hover:bg-[#00b000] text-white text-sm rounded-md"
              >
                LINEで送る
              </Button>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${encodedHashtags}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-sm rounded-md"
              >
                ポストする
              </Button>
            </a>
          </>
        ))}
    </div>
  );
}
