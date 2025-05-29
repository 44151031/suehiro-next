// src/components/ui/Button/Button.tsx
import Link from "next/link";
import React from "react";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  children,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClass =
    "inline-block bg-white text-[#f7931e] border border-[#f7931e] text-base font-bold px-6 py-3 rounded-full shadow hover:bg-[#f7931e] hover:text-white transition-colors";

  // hrefがある場合はLink、なければbutton
  if (href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}