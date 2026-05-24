import type { Technology } from "@/data/types";

type TechnologyIconSize = "sm" | "md" | "lg";

const sizeClasses: Record<
  TechnologyIconSize,
  { wrapper: string; svg: string; devicon: string }
> = {
  sm: {
    wrapper: "h-8 w-8 rounded-lg",
    svg: "h-4 w-4",
    devicon: "text-base",
  },
  md: {
    wrapper: "h-12 w-12 rounded-xl",
    svg: "h-6 w-6",
    devicon: "text-2xl",
  },
  lg: {
    wrapper: "h-16 w-16 rounded-2xl",
    svg: "h-8 w-8",
    devicon: "text-4xl",
  },
};

function CustomTechnologyGlyph({
  technologyId,
  className,
}: {
  technologyId: string;
  className: string;
}) {
  switch (technologyId) {
    case "fullstack":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <rect x="3.5" y="4" width="8" height="5" rx="1.5" />
          <rect x="12.5" y="15" width="8" height="5" rx="1.5" />
          <path d="M11.5 6.5h2.5a2 2 0 0 1 2 2V15" />
          <path d="M8 15h4.5" />
          <path d="M8 12v6" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <circle cx="12" cy="12" r="5.5" />
          <path d="M9.5 10h5M9.5 12.5h5M11 8.5v7" />
          <path d="M18 6.5 19.5 5M18 17.5l1.5 1.5M6 6.5 4.5 5M6 17.5 4.5 19" />
        </svg>
      );
    case "dsa":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="18" cy="7" r="2.2" />
          <circle cx="9" cy="18" r="2.2" />
          <circle cx="18" cy="17" r="2.2" />
          <path d="M7.8 7.2 16.2 18" />
          <path d="M8 6.4h7.8" />
          <path d="M10.9 16.9 16 17.1" />
        </svg>
      );
    case "orm":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <ellipse cx="8" cy="7" rx="4.5" ry="2.5" />
          <path d="M3.5 7v6c0 1.4 2 2.5 4.5 2.5s4.5-1.1 4.5-2.5V7" />
          <rect x="14.5" y="11.5" width="6" height="6" rx="1.2" />
          <path d="M12.5 12.5h2" />
          <path d="M12 9.5h4" />
        </svg>
      );
    case "environment":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <rect x="3.5" y="5" width="17" height="13" rx="2" />
          <path d="M7 10.5 9 12l-2 1.5" />
          <path d="M11 13.5h4" />
          <path d="M3.5 8h17" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M7 18.5h10a3.5 3.5 0 0 0 .6-6.9A5.5 5.5 0 0 0 7.2 9.5 4.5 4.5 0 0 0 7 18.5Z" />
          <path d="m10 12 2-2 2 2" />
          <path d="M12 10v6" />
        </svg>
      );
    case "packageManagers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M12 3.5 19 7v10l-7 3.5L5 17V7L12 3.5Z" />
          <path d="M5 7 12 10.5 19 7" />
          <path d="M12 10.5V20.5" />
        </svg>
      );
    case "cicd":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <circle cx="6" cy="7" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="17" r="2" />
          <path d="M7.5 8.5 10.5 10.5" />
          <path d="M13.5 13.5 16.5 15.5" />
          <path d="M13.7 10.5h3.8V6.5" />
        </svg>
      );
    case "tanstack-query":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <ellipse cx="12" cy="8" rx="5.5" ry="3" />
          <path d="M6.5 8v5c0 1.66 2.46 3 5.5 3s5.5-1.34 5.5-3V8" />
          <path d="M16 17.5a3 3 0 1 0 0-3 3 3 0 0 0 0 3Z" />
          <path d="M17.5 13.5 19 12" />
        </svg>
      );
    case "zustand":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
          <path d="M11 7.5h2M7.5 11v2M16.5 11v2M13 16.5h2" />
        </svg>
      );
    case "websockets":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M5 9 3 12l2 3" />
          <path d="M19 9l2 3-2 3" />
          <path d="M9 5l3-2 3 2" />
          <path d="M9 19l3 2 3-2" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M9.5 9.5 7 7M14.5 9.5 17 7M9.5 14.5 7 17M14.5 14.5 17 17" />
        </svg>
      );
    case "authentication":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "web-security":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M12 3 4 6v5.5C4 16 7.5 20 12 21c4.5-1 8-5 8-9.5V6L12 3Z" />
          <path d="M12 9v4M12 15h.01" />
        </svg>
      );
    case "design-patterns":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="12" cy="17" r="3" />
          <path d="M10 7h4M9.3 9.3 12 14M14.7 9.3 12 14" />
        </svg>
      );
    case "monitoring":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <polyline points="3,14 7,10 10,13 14,7 17,11 21,8" />
          <path d="M3 19h18" />
        </svg>
      );
    default:
      return null;
  }
}

export function TechnologyIcon({
  technology,
  size = "md",
}: {
  technology: Technology;
  size?: TechnologyIconSize;
}) {
  const classes = sizeClasses[size];
  const customTechnologyIds = new Set([
    "fullstack",
    "ai",
    "dsa",
    "orm",
    "environment",
    "cloud",
    "packageManagers",
    "cicd",
    "tanstack-query",
    "zustand",
    "websockets",
    "authentication",
    "web-security",
    "design-patterns",
    "monitoring",
  ]);
  const hasCustomGlyph = customTechnologyIds.has(technology.id);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-(--border) bg-(--bg-elevated) ${classes.wrapper}`}
      aria-hidden
    >
      {hasCustomGlyph ? (
        <CustomTechnologyGlyph
          technologyId={technology.id}
          className={`${classes.svg} text-(--accent-fg)`}
        />
      ) : (
        // suppressHydrationWarning prevents React mismatch warnings caused by
        // CSS icon fonts or browser extensions modifying this leaf node.
        <i
          className={`${technology.deviconClass} ${classes.devicon}`}
          suppressHydrationWarning
        />
      )}
    </span>
  );
}
