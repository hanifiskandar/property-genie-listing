import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { fetchProperties } from "@/lib/api";
import { propertyCache } from "@/lib/propertyCache";
import { queryToFilters, queryToPage, queryToSort } from "@/lib/utils";
import type { PropertyListing, PropertyMeta, FilterState, SortOption } from "@/lib/types";

interface UsePropertiesOptions {
  initialItems?: PropertyListing[];
  initialMeta?: PropertyMeta;
}

interface UsePropertiesResult {
  items: PropertyListing[];
  meta: PropertyMeta | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const DEFAULT_META: PropertyMeta = {
  totalCount: 0,
  pageCount: 0,
  currentPage: 1,
  perPage: 20,
};

export function useProperties({
  initialItems = [],
  initialMeta,
}: UsePropertiesOptions = {}): UsePropertiesResult {
  const router = useRouter();
  const [items, setItems] = useState<PropertyListing[]>(initialItems);
  const [meta, setMeta] = useState<PropertyMeta | null>(initialMeta ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether we've done the first client-side fetch to avoid double-fetching SSR data
  const isFirstRender = useRef(true);

  const doFetch = useCallback(
    async (filters: FilterState, page: number, sort: SortOption, name?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProperties(filters, page, sort, name);
        propertyCache.set(data.items);
        setItems(data.items);
        setMeta(data._meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Skip the very first render — SSR already provided the data
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!router.isReady) return;

    const filters = queryToFilters(router.query);
    const page = queryToPage(router.query);
    const sort = queryToSort(router.query);
    const name = typeof router.query.name === "string" ? router.query.name : undefined;
    doFetch(filters, page, sort, name);
  }, [router.query, router.isReady, doFetch]);

  const retry = useCallback(() => {
    if (!router.isReady) return;
    const filters = queryToFilters(router.query);
    const page = queryToPage(router.query);
    const sort = queryToSort(router.query);
    const name = typeof router.query.name === "string" ? router.query.name : undefined;
    doFetch(filters, page, sort, name);
  }, [router.query, router.isReady, doFetch]);

  return { items, meta: meta ?? DEFAULT_META, isLoading, error, retry };
}
