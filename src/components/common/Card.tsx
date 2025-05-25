// components/common/Card.tsx
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white text-card-foreground border border-border rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-5 ${className}`}
    >
      {children}
    </div>
  );
}
