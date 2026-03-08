import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  const finalClassName = ["app-button", className].filter(Boolean).join(" ");

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
}
