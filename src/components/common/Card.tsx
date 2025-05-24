// components/common/Card.tsx
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground border border-border rounded-xl shadow-md hover:shadow-lg transition p-4 ${className}`}
    >
      {children}
    </div>
  );
}
