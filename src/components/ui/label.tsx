import React from "react";

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="block mb-1" {...props}>
      {children}
    </label>
  );
}
