"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-sm text-red-700 mb-4 font-mono break-all">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-xs text-red-500 mb-4">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
