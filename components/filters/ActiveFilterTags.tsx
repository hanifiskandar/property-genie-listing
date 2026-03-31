import { X } from "lucide-react";
import { formatPrice, DEFAULT_SORT } from "@/lib/utils";
import type { FilterState, SortOption } from "@/lib/types";

interface ActiveFilterTagsProps {
  filters: FilterState;
  sort: SortOption;
  onRemoveLocation: () => void;
  onRemoveCategory: (cat: string) => void;
  onRemoveType: (type: string) => void;
  onRemoveMinPrice: () => void;
  onRemoveMaxPrice: () => void;
  onResetSort: () => void;
  onClearAll: () => void;
  variant?: "light" | "dark";
}

const SORT_LABELS: Record<SortOption, string> = {
  createdAt:    "Default",
  "-createdAt": "Newest First",
  price:        "Price: Low→High",
  "-price":     "Price: High→Low",
};

export function ActiveFilterTags({
  filters, sort,
  onRemoveLocation, onRemoveCategory, onRemoveType,
  onRemoveMinPrice, onRemoveMaxPrice, onResetSort, onClearAll,
  variant = "light",
}: ActiveFilterTagsProps) {
  const tags: { label: string; onRemove: () => void }[] = [];

  if (filters.location)          tags.push({ label: filters.locationTitle || filters.location, onRemove: onRemoveLocation });
  filters.categories.forEach((c) => tags.push({ label: c,                                    onRemove: () => onRemoveCategory(c) }));
  filters.types.forEach((t)      => tags.push({ label: t,                                    onRemove: () => onRemoveType(t) }));
  if (filters.minPrice !== null)   tags.push({ label: `≥ ${formatPrice(filters.minPrice)}`,  onRemove: onRemoveMinPrice });
  if (filters.maxPrice !== null)   tags.push({ label: `≤ ${formatPrice(filters.maxPrice)}`,  onRemove: onRemoveMaxPrice });
  if (sort !== DEFAULT_SORT)       tags.push({ label: SORT_LABELS[sort],                      onRemove: onResetSort });

  if (tags.length === 0) return null;

  const tagClass = variant === "dark"
    ? "inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-white/15 text-white text-xs font-medium capitalize border border-white/20"
    : "inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium capitalize border border-indigo-200";

  const removeClass = variant === "dark"
    ? "ml-0.5 text-white/50 hover:text-white transition-colors rounded-full"
    : "ml-0.5 text-indigo-400 hover:text-indigo-700 transition-colors rounded-full";

  const clearClass = variant === "dark"
    ? "h-6 px-2 text-xs text-white/50 hover:text-white transition-colors font-medium"
    : "h-6 px-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span key={tag.label} className={tagClass}>
          {tag.label}
          <button
            onClick={tag.onRemove}
            aria-label={`Remove ${tag.label} filter`}
            className={removeClass}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <button onClick={onClearAll} className={clearClass}>
        Clear all
      </button>
    </div>
  );
}
