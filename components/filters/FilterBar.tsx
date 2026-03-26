import { useState } from "react";
import { SlidersHorizontal, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSearch } from "./LocationSearch";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SortSelect } from "./SortSelect";
import { ActiveFilterTags } from "./ActiveFilterTags";
import { SaveSearchDialog } from "@/components/saved-searches/SaveSearchDialog";
import { DEFAULT_FILTERS, DEFAULT_SORT } from "@/lib/utils";
import type { FilterState, SortOption } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  sort: SortOption;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({ filters, sort, onFiltersChange, onSortChange }: FilterBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const update = (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch });
  const clearAll = () => { onFiltersChange(DEFAULT_FILTERS); onSortChange(DEFAULT_SORT); };

  return (
    <div className="bg-white border-b border-gray-200/80 sticky top-16 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium pr-1">
            <SlidersHorizontal size={13} />
            <span className="hidden md:inline">Filters</span>
          </div>
          <div className="w-px h-5 bg-gray-200" />

          <LocationSearch
            value={filters.location}
            onChange={(loc) => update({ location: loc })}
          />
          <PropertyTypeFilter
            categories={filters.categories}
            types={filters.types}
            onCategoriesChange={(c) => update({ categories: c })}
            onTypesChange={(t) => update({ types: t })}
          />
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={(v) => update({ minPrice: v })}
            onMaxPriceChange={(v) => update({ maxPrice: v })}
          />

          <div className="ml-auto flex items-center gap-2">
            <SortSelect value={sort} onChange={onSortChange} />
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-sm font-medium text-indigo-600 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-500 transition-all"
              onClick={() => setSaveDialogOpen(true)}
            >
              <BookmarkPlus size={14} />
              <span className="hidden sm:inline">Save Search</span>
            </Button>
          </div>
        </div>

        <div className="mt-2.5">
          <ActiveFilterTags
            filters={filters}
            sort={sort}
            onRemoveLocation={() => update({ location: "" })}
            onRemoveCategory={(cat) => update({ categories: filters.categories.filter((c) => c !== cat) })}
            onRemoveType={(type) => update({ types: filters.types.filter((t) => t !== type) })}
            onRemoveMinPrice={() => update({ minPrice: null })}
            onRemoveMaxPrice={() => update({ maxPrice: null })}
            onResetSort={() => onSortChange(DEFAULT_SORT)}
            onClearAll={clearAll}
          />
        </div>
      </div>

      <SaveSearchDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        filters={filters}
        sort={sort}
      />
    </div>
  );
}
