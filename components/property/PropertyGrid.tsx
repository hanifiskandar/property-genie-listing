import { PropertyCard } from "./PropertyCard";
import { PropertyListCard } from "./PropertyListCard";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import type { PropertyListing } from "@/lib/types";
import type { ViewMode } from "@/hooks/useViewMode";

interface PropertyGridProps {
  items: PropertyListing[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onClearFilters: () => void;
  viewMode?: ViewMode;
}

export function PropertyGrid({
  items,
  isLoading,
  error,
  onRetry,
  onClearFilters,
  viewMode = "grid",
}: PropertyGridProps) {
  const isGrid = viewMode === "grid";
  const containerClass = isGrid
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    : "flex flex-col gap-4";

  return (
    <div className={containerClass}>
      {isLoading ? (
        Array.from({ length: isGrid ? 6 : 4 }, (_, i) => (
          <SkeletonCard key={i} viewMode={viewMode} />
        ))
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} />
      ) : isGrid ? (
        items.map((property, i) => <PropertyCard key={property.id} property={property} index={i} />)
      ) : (
        items.map((property, i) => <PropertyListCard key={property.id} property={property} index={i} />)
      )}
    </div>
  );
}
