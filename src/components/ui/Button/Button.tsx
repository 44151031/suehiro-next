// src/components/ui/Button/Button.tsx
import Link from "next/link";
import React from "react";
import "./button.css";

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
    "inline-block bg-primary text-primary-foreground font-bold text-sm rounded-full px-6 py-2 hover:bg-accent hover:text-accent-foreground transition";

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