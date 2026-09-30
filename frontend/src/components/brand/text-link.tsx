import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TextLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  tone?: "dark" | "light";
};

export function TextLink({
  to,
  children,
  className,
  showArrow = true,
  tone = "dark",
}: TextLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-3 label-caps transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        tone === "light" ? "text-white" : "text-foreground",
        className,
      )}
    >
      <span className="border-b border-current/40 pb-0.5 transition-[border-color] duration-300 group-hover:border-current">
        {children}
      </span>
      {showArrow ? (
        <ArrowRight
          className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

type TextButtonProps = ComponentPropsWithoutRef<"button"> & {
  showArrow?: boolean;
  tone?: "dark" | "light" | "outline-light" | "outline-dark";
};

export function TextButton({
  children,
  className,
  showArrow = false,
  tone = "dark",
  type = "button",
  ...props
}: TextButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "group inline-flex items-center justify-center gap-3 px-7 py-3.5 label-caps transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        tone === "dark" && "bg-foreground text-background hover:bg-foreground/85",
        tone === "light" && "bg-white text-foreground hover:bg-white/90",
        tone === "outline-dark" &&
          "border border-foreground/80 text-foreground hover:bg-foreground hover:text-background",
        tone === "outline-light" &&
          "border border-white/80 text-white hover:bg-white hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow ? (
        <ArrowRight
          className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          aria-hidden
        />
      ) : null}
    </button>
  );
}
