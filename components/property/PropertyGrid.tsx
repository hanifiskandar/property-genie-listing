import { PropertyCard } from "./PropertyCard";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import type { PropertyListing } from "@/lib/types";

interface PropertyGridProps {
  items: PropertyListing[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function PropertyGrid({
  items,
  isLoading,
  error,
  onRetry,
  onClearFilters,
}: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {isLoading ? (
        Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} />
      ) : (
        items.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      )}
    </div>
  );
}
