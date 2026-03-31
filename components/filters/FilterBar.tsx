import { useState, useEffect } from "react";
import { Search, BookmarkPlus, X } from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SortSelect } from "./SortSelect";
import { ActiveFilterTags } from "./ActiveFilterTags";
import { SaveSearchDialog } from "@/components/saved-searches/SaveSearchDialog";
import { DEFAULT_FILTERS, DEFAULT_SORT } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import type { FilterState, SortOption } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  sort: SortOption;
  searchValue: string;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (name: string) => void;
}

export function FilterBar({
  filters, sort, searchValue,
  onFiltersChange, onSortChange, onSearchChange,
}: FilterBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => { setLocalSearch(searchValue); }, [searchValue]);
  useEffect(() => {
    if (debouncedSearch !== searchValue) onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const update = (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch });
  const clearAll = () => { onFiltersChange(DEFAULT_FILTERS); onSortChange(DEFAULT_SORT); };

  return (
    <div className="bg-gray-50 border-b border-gray-200 shadow-sm sticky top-16 z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">

        {/* Search input — full width, white on dark */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search properties by name..."
            className="w-full h-11 pl-10 pr-9 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter row — horizontal scroll on mobile, wrap on desktop */}
        <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-0.5 sm:pb-0">
          <LocationSearch
            value={filters.location}
            displayTitle={filters.locationTitle}
            onChange={(slug, title) => update({ location: slug, locationTitle: title })}
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

          {/* Sort + Save — push to right on desktop, stay inline on mobile */}
          <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
            <SortSelect value={sort} onChange={onSortChange} />
            <button
              onClick={() => setSaveDialogOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
            >
              <BookmarkPlus size={14} />
              <span className="hidden sm:inline">Save Search</span>
            </button>
          </div>
        </div>

        {/* Active filter tags — contrasted for dark bg */}
        <ActiveFilterTags
          filters={filters}
          sort={sort}
          onRemoveLocation={() => update({ location: "", locationTitle: "" })}
          onRemoveCategory={(cat) => update({ categories: filters.categories.filter((c) => c !== cat) })}
          onRemoveType={(type) => update({ types: filters.types.filter((t) => t !== type) })}
          onRemoveMinPrice={() => update({ minPrice: null })}
          onRemoveMaxPrice={() => update({ maxPrice: null })}
          onResetSort={() => onSortChange(DEFAULT_SORT)}
          onClearAll={clearAll}
          variant="light"
        />
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
