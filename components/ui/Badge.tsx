import { clsx } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-border text-ink-secondary",
  primary:  "bg-brand-light text-brand",       // Deep Navy, Best Overall
  success:  "bg-cta-light text-cta-dark",       // Calm Teal, Easiest to Use / Best Simple Controls
  warning:  "bg-accent-light text-accent-dark", // Warm Amber, Best Value only
  info:     "bg-cta-light text-cta-dark",
  muted:    "bg-bg text-ink-muted border border-border",
};

// MachineFanatic badge color rules: navy = Best Overall, teal = Easiest to Use /
// Best Simple Controls, amber = Best Value only. No Amazon-style gold stars.
const autoVariantMap: Record<string, BadgeVariant> = {
  "Best Overall":             "primary",
  "Editor's Choice":          "primary",
  "Easiest to Use":           "success",
  "Best Simple Controls":     "success",
  "Best Value":               "warning",
  "Best Budget":              "warning",
  "Machine Score":             "primary",
};

export function Badge({ children, variant, className }: BadgeProps) {
  const resolved = variant ?? autoVariantMap[String(children)] ?? "default";

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-badge text-xs font-semibold tracking-wide",
        variantStyles[resolved],
        className
      )}
    >
      {children}
    </span>
  );
}
