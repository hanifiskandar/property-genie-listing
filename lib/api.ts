import type { FilterState, PropertyApiResponse, PropertyDetail, PropertyListing, LocationResult, SortOption } from "./types";

const EXTERNAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Evaluated at call time so HMR can never freeze the wrong value.
const isServer = () => typeof window === "undefined";

// Browser calls the Next.js proxy (same-origin, no CORS).
// Server calls the external API directly.
function propertiesUrl(page: number, sort: SortOption | ""): string {
  if (isServer()) {
    const u = new URL(`${EXTERNAL_BASE}/properties-mock`);
    u.searchParams.set("page", String(page));
    if (sort) u.searchParams.set("sort", sort);
    return u.toString();
  }
  const u = new URL("/api/properties", window.location.origin);
  u.searchParams.set("page", String(page));
  if (sort) u.searchParams.set("sort", sort);
  return u.toString();
}

function locationsUrl(keyword: string): string {
  if (isServer()) {
    const u = new URL(`${EXTERNAL_BASE}/locations-mock`);
    u.searchParams.set("keyword", keyword);
    return u.toString();
  }
  const u = new URL("/api/locations", window.location.origin);
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
  console.log("[fetchProperties] request URL:", url);

  const body: Record<string, unknown> = { section: "sale" };
  if (name) body.name = name;
  if (filters.locationTitle) body.location = filters.locationTitle;
  else if (filters.location) body.location = filters.location.replace(/^\//, "");
  if (filters.categories.length > 0) body.categories = filters.categories;
  if (filters.types.length > 0) body.types = filters.types;
  if (filters.minPrice !== null) body.minPrice = filters.minPrice;
  if (filters.maxPrice !== null) body.maxPrice = filters.maxPrice;

  console.log("[fetchProperties] request body:", JSON.stringify(body));

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

/**
 * There is no dedicated property-detail endpoint.
 * Paginate through the list API until the property with the given id is found.
 * Searches up to `maxPages` pages before giving up.
 */
export async function findPropertyById(id: string, maxPages = 10): Promise<PropertyDetail> {
  for (let page = 1; page <= maxPages; page++) {
    const url = propertiesUrl(page, "-createdAt");
    const body: Record<string, unknown> = { section: "sale" };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = (await res.json()) as PropertyApiResponse;
    const match = data.items.find((item) => item.id === id);
    if (match) return match as PropertyDetail;
    if (page >= data._meta.pageCount) break;
  }
  throw new Error("Property not found.");
}

/**
 * Fetches all pages from the list API and returns properties belonging to the given agent.
 * The mock API has no agent-filter endpoint, so we collect everything and filter client-side.
 */
export async function findPropertiesByAgent(
  agentId: string,
  maxPages = 20
): Promise<PropertyListing[]> {
  const results: PropertyListing[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = propertiesUrl(page, "-createdAt");
    const body: Record<string, unknown> = { section: "sale" };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = (await res.json()) as PropertyApiResponse;
    const matches = data.items.filter((item) => item.account.id === agentId);
    results.push(...matches);
    if (page >= data._meta.pageCount) break;
  }
  return results;
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
