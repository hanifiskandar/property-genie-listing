"use client";

import { useState, useEffect } from "react";
import { MapPin, X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fetchLocations } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import type { LocationResult } from "@/lib/types";

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
}

export function LocationSearch({ value, onChange }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setLoading(true);
    fetchLocations(debouncedQuery)
      .then(setResults).catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => { setQuery(value); }, [value]);

  const handleSelect = (loc: string) => { onChange(loc); setQuery(loc); setOpen(false); };
  const handleClear = () => { onChange(""); setQuery(""); setResults([]); };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border text-sm font-medium transition-all shrink-0",
              "bg-white text-gray-700 border-gray-200",
              "hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50",
              value && "border-indigo-200 border-l-4 border-l-indigo-600 text-indigo-600 bg-indigo-50"
            )}
          >
            <MapPin size={13} className="shrink-0" />
            <span className="max-w-[130px] truncate">{value || "Location"}</span>
            {value ? (
              <span
                role="button" tabIndex={0}
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleClear(); } }}
                className="text-gray-400 hover:text-gray-700 ml-0.5"
                aria-label="Clear location"
              >
                <X size={12} />
              </span>
            ) : (
              <ChevronDown size={13} className="text-gray-400" />
            )}
          </button>
        }
      />
      <PopoverContent className="w-64 p-0 border-gray-200 shadow-lg" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search city or state…" value={query} onValueChange={setQuery} />
          <CommandList>
            {loading ? (
              <CommandEmpty>Searching…</CommandEmpty>
            ) : results.length === 0 && debouncedQuery.trim() ? (
              <CommandEmpty>No locations found.</CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>Type to search locations.</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((r) => (
                  <CommandItem key={r.id} value={r.name} onSelect={() => handleSelect(r.name)}>
                    <MapPin size={13} className="text-gray-400 shrink-0" />
                    <span className="text-gray-800">{r.name}</span>
                    {r.type && (
                      <span className="ml-auto text-xs text-gray-400 capitalize">{r.type}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
