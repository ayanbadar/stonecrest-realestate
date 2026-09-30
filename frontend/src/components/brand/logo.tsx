import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "dark" | "light";
  showDescriptor?: boolean;
  className?: string;
};

export function Logo({
  variant = "dark",
  showDescriptor = true,
  className,
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      to={ROUTES.root()}
      className={cn(
        "group inline-flex flex-col items-center text-center outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      aria-label="Stonecrest Real Estate — Home"
    >
      <span
        className={cn(
          "font-sans text-[0.95rem] font-medium tracking-[0.22em] uppercase transition-opacity duration-300 group-hover:opacity-80 sm:text-[1.05rem]",
          isLight ? "text-white" : "text-foreground",
        )}
      >
        Stonecrest
      </span>
      {showDescriptor ? (
        <>
          <span
            className={cn(
              "mt-1 label-caps",
              isLight ? "text-white/75" : "text-muted-foreground",
            )}
          >
            Real Estate
          </span>
          <span
            className={cn(
              "mt-2 h-px w-8",
              isLight ? "bg-white/80" : "bg-foreground/80",
            )}
            aria-hidden
          />
        </>
      ) : (
        <span
          className={cn(
            "mt-1.5 h-px w-6",
            isLight ? "bg-white/80" : "bg-foreground/80",
          )}
          aria-hidden
        />
      )}
    </Link>
  );
}
