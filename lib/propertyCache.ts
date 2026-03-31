/**
 * Client-side in-memory cache for property listings.
 * Populated by useProperties when items are fetched, read by the detail page.
 */
import type { PropertyListing } from "./types";

const cache = new Map<string, PropertyListing>();

export const propertyCache = {
  set(items: PropertyListing[]) {
    for (const item of items) {
      cache.set(item.id, item);
    }
  },
  get(id: string): PropertyListing | undefined {
    return cache.get(id);
  },
};
