import React from "react";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" {...props}>
      {children}
    </button>
  );
}
