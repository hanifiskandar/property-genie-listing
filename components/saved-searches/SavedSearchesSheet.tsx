import { Trash2, SearchCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { formatPrice } from "@/lib/utils";
import type { SavedSearch } from "@/lib/types";

interface SavedSearchesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SavedSearchesSheet({ open, onOpenChange }: SavedSearchesSheetProps) {
  const { savedSearches, remove, applySearch } = useSavedSearches();

  const handleApply = (search: SavedSearch) => {
    applySearch(search);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader>
          <SheetTitle>Saved Searches</SheetTitle>
          <SheetDescription>
            {savedSearches.length === 0
              ? "No saved searches yet."
              : `${savedSearches.length} saved search${savedSearches.length === 1 ? "" : "es"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-2 space-y-2">
          {savedSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <SearchCheck size={32} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Save your current filters to quickly access them later.
              </p>
            </div>
          ) : (
            savedSearches.map((search) => (
              <SavedSearchItem
                key={search.id}
                search={search}
                onApply={() => handleApply(search)}
                onDelete={() => remove(search.id)}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SavedSearchItem({
  search,
  onApply,
  onDelete,
}: {
  search: SavedSearch;
  onApply: () => void;
  onDelete: () => void;
}) {
  const { filters } = search;
  const tags: string[] = [];
  if (filters.location) tags.push(filters.location);
  if (filters.categories.length) tags.push(...filters.categories);
  if (filters.types.length) tags.push(...filters.types);
  if (filters.minPrice) tags.push(`≥ ${formatPrice(filters.minPrice)}`);
  if (filters.maxPrice) tags.push(`≤ ${formatPrice(filters.maxPrice)}`);

  const createdAt = new Date(search.createdAt).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{search.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{createdAt}</p>
        </div>
        <button
          onClick={onDelete}
          aria-label="Delete saved search"
          className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs h-5 capitalize font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Button
        size="sm"
        variant="outline"
        className="w-full h-7 text-xs font-medium text-primary border-primary/30 hover:bg-primary/5"
        onClick={onApply}
      >
        Apply Search
      </Button>
    </div>
  );
}
