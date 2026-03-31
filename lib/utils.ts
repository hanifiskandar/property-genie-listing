import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ParsedUrlQuery } from "querystring";
import type { FilterState, SortOption } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `RM ${price.toLocaleString("en-MY")}`;
}

export function formatArea(sqft: string | null): string {
  if (!sqft) return "—";
  return `${parseFloat(sqft).toLocaleString("en-MY")} sqft`;
}

export const DEFAULT_FILTERS: FilterState = {
  location: "",
  locationTitle: "",
  categories: [],
  types: [],
  minPrice: null,
  maxPrice: null,
};

export const DEFAULT_SORT: SortOption = "createdAt";

export function filtersToQuery(
  filters: FilterState,
  page: number,
  sort: SortOption | ""
): Record<string, string> {
  const params: Record<string, string> = { page: String(page) };
  if (sort) params.sort = sort;
  if (filters.location) params.location = filters.location;
  if (filters.locationTitle) params.locationTitle = filters.locationTitle;
  if (filters.categories.length > 0) params.categories = filters.categories.join(",");
  if (filters.types.length > 0) params.types = filters.types.join(",");
  if (filters.minPrice !== null) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== null) params.maxPrice = String(filters.maxPrice);
  return params;
}

export function queryToFilters(query: ParsedUrlQuery): FilterState {
  return {
    location: typeof query.location === "string" ? query.location : "",
    locationTitle: typeof query.locationTitle === "string" ? query.locationTitle : "",
    categories:
      typeof query.categories === "string" && query.categories
        ? query.categories.split(",").filter(Boolean)
        : [],
    types:
      typeof query.types === "string" && query.types
        ? query.types.split(",").filter(Boolean)
        : [],
    minPrice: typeof query.minPrice === "string" ? Number(query.minPrice) : null,
    maxPrice: typeof query.maxPrice === "string" ? Number(query.maxPrice) : null,
  };
}

export function queryToSort(query: ParsedUrlQuery): SortOption {
  const validSorts: SortOption[] = ["price", "-price", "createdAt", "-createdAt"];
  const raw = typeof query.sort === "string" ? query.sort : "";
  return validSorts.includes(raw as SortOption) ? (raw as SortOption) : DEFAULT_SORT;
}

export function queryToPage(query: ParsedUrlQuery): number {
  const p = typeof query.page === "string" ? parseInt(query.page, 10) : 1;
  return isNaN(p) || p < 1 ? 1 : p;
}
