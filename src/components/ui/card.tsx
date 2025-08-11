import React from "react";

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="border rounded-lg bg-white shadow" {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="p-6" {...props}>
      {children}
    </div>
  );
}
