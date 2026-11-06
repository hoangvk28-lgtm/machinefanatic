interface AdminFormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function AdminFormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: AdminFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";

export const selectClass =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";

export const textareaClass =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y min-h-[80px]";
