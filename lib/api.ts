import type { FilterState, PropertyApiResponse, LocationResult, SortOption } from "./types";

const IS_BROWSER = typeof window !== "undefined";
const EXTERNAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Server-side: call external API directly (no CORS).
// Browser-side: call Next.js proxy routes (same-origin → no CORS).
function propertiesUrl(page: number, sort: SortOption | ""): string {
  if (IS_BROWSER) {
    const u = new URL("/api/properties", window.location.origin);
    u.searchParams.set("page", String(page));
    if (sort) u.searchParams.set("sort", sort);
    return u.toString();
  }
  const u = new URL(`${EXTERNAL_BASE}/properties-mock`);
  u.searchParams.set("page", String(page));
  if (sort) u.searchParams.set("sort", sort);
  return u.toString();
}

function locationsUrl(keyword: string): string {
  if (IS_BROWSER) {
    const u = new URL("/api/locations", window.location.origin);
    u.searchParams.set("keyword", keyword);
    return u.toString();
  }
  const u = new URL(`${EXTERNAL_BASE}/locations-mock`);
  u.searchParams.set("keyword", keyword);
  return u.toString();
}

export async function fetchProperties(
  filters: FilterState,
  page: number,
  sort: SortOption | "",
  name?: string
): Promise<PropertyApiResponse> {
  const url = propertiesUrl(page, sort);

  const body: Record<string, unknown> = { section: "sale" };
  if (name) body.name = name;
  if (filters.categories.length > 0) body.categories = filters.categories;
  if (filters.types.length > 0) body.types = filters.types;
  if (filters.minPrice !== null) body.minPrice = filters.minPrice;
  if (filters.maxPrice !== null) body.maxPrice = filters.maxPrice;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<PropertyApiResponse>;
}

export async function fetchLocations(keyword: string): Promise<LocationResult[]> {
  if (!keyword.trim()) return [];

  const res = await fetch(locationsUrl(keyword));
  if (!res.ok) {
    throw new Error(`Locations API error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) return data as LocationResult[];
  if (data && Array.isArray(data.items)) return data.items as LocationResult[];
  return [];
}
