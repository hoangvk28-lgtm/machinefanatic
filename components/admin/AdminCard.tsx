interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  /** Compact padding (default: normal) */
  compact?: boolean;
}

export function AdminCard({ children, className = "", compact = false }: AdminCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${compact ? "p-4" : "p-6"} ${className}`}
    >
      {children}
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  trendUp?: boolean;
}

export function AdminStatCard({
  label,
  value,
  icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
  trend,
  trendUp,
}: AdminStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
        {trend && (
          <p className={`text-xs mt-1.5 font-medium ${trendUp ? "text-emerald-600" : "text-amber-600"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

interface AdminAlertCardProps {
  title: string;
  description: string;
  count: number;
  severity: "warning" | "error" | "success";
  action?: React.ReactNode;
}

export function AdminAlertCard({ title, description, count, severity, action }: AdminAlertCardProps) {
  const styles = {
    warning: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-800", icon: "text-amber-500" },
    error:   { bg: "bg-red-50",   border: "border-red-200",   badge: "bg-red-100 text-red-800",     icon: "text-red-500"   },
    success: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800", icon: "text-emerald-500" },
  };
  const s = styles[severity];

  return (
    <div className={`rounded-xl border ${s.bg} ${s.border} p-5 flex items-start gap-4`}>
      <div className={`shrink-0 mt-0.5 ${s.icon}`}>
        {severity === "success" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${s.badge}`}>{count}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
