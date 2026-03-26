import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedSearchesSheet } from "@/components/saved-searches/SavedSearchesSheet";
import { useDebounce } from "@/hooks/useDebounce";

interface NavbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Navbar({ searchValue, onSearchChange }: NavbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [sheetOpen, setSheetOpen] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => { setLocalSearch(searchValue); }, [searchValue]);

  useEffect(() => {
    if (debouncedSearch !== searchValue) onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

        {/* Logo */}
        <a href="/" className="shrink-0">
          <Image src="/logo.webp" alt="PropertyGenie" width={120} height={40} priority />
        </a>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search properties by name..."
            className="w-full h-10 pl-10 pr-9 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Saved searches */}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 h-9 gap-1.5 text-sm font-medium text-gray-700 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          onClick={() => setSheetOpen(true)}
        >
          <Bookmark size={14} />
          <span className="hidden sm:inline">Saved</span>
        </Button>
      </div>

      <SavedSearchesSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </header>
  );
}
