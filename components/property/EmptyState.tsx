import { Building2 } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Building2 size={28} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">No properties found</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Try adjusting your filters or searching in a different location.
      </p>
      <button
        onClick={onClearFilters}
        className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all"
      >
        Clear filters
      </button>
    </div>
  );
}
