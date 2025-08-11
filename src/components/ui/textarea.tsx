import React from "react";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="border px-2 py-1 w-full min-h-[80px]" {...props} />;
}
