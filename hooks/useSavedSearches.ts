import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { filtersToQuery } from "@/lib/utils";
import type { SavedSearch, FilterState, SortOption } from "@/lib/types";

const STORAGE_KEY = "pg_saved_searches";

function loadFromStorage(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedSearch[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(searches: SavedSearch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function useSavedSearches() {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    setSavedSearches(loadFromStorage());
  }, []);

  const save = useCallback((name: string, filters: FilterState, sort: SortOption) => {
    const newSearch: SavedSearch = {
      id: crypto.randomUUID(),
      name: name.trim() || "Unnamed Search",
      filters,
      sort,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((prev) => {
      const updated = [newSearch, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSavedSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const applySearch = useCallback(
    (search: SavedSearch) => {
      const params = filtersToQuery(search.filters, 1, search.sort);
      router.push({ pathname: "/", query: params }, undefined, { shallow: true });
    },
    [router]
  );

  return { savedSearches, save, remove, applySearch };
}
