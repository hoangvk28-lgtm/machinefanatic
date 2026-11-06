type StatusVariant =
  | "published"
  | "draft"
  | "verified"
  | "active"
  | "inactive"
  | "warning"
  | "success"
  | "info";

interface AdminStatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  published: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  draft:     "bg-gray-100  text-gray-600   border border-gray-200",
  verified:  "bg-purple-50 text-purple-700 border border-purple-200",
  active:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactive:  "bg-gray-100  text-gray-500   border border-gray-200",
  warning:   "bg-amber-50  text-amber-700  border border-amber-200",
  success:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  info:      "bg-blue-50   text-blue-700   border border-blue-200",
};

const DOT_COLORS: Record<StatusVariant, string> = {
  published: "bg-emerald-500",
  draft:     "bg-gray-400",
  verified:  "bg-purple-500",
  active:    "bg-emerald-500",
  inactive:  "bg-gray-400",
  warning:   "bg-amber-500",
  success:   "bg-emerald-500",
  info:      "bg-blue-500",
};

export function AdminStatusBadge({ status, label }: AdminStatusBadgeProps) {
  const variant = (status as StatusVariant) in VARIANT_STYLES ? (status as StatusVariant) : "info";
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${VARIANT_STYLES[variant]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLORS[variant]}`} />
      {displayLabel}
    </span>
  );
}
