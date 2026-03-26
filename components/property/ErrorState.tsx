import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        {message ?? "Unable to load properties. Please try again."}
      </p>
      <button
        onClick={onRetry}
        className="h-9 px-4 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
