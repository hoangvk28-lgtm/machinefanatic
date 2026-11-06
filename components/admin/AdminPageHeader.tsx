interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
