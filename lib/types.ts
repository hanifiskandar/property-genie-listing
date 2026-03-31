export interface PropertyAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  slug: string;
}

export interface PropertyCoordinates {
  longitude: number;
  latitude: number;
}

export interface PropertyListing {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  section: "sale" | "rent";
  image: string;
  bedRooms: number;
  bathRooms: number;
  floorSize: string;
  landSize: string | null;
  address: string;
  price: number;
  account: PropertyAccount;
  country: string;
  state: string;
  city: string;
  postcode: string;
  furnishings: string;
  coordinates: PropertyCoordinates;
  createdAt: string;
}

export interface PropertyMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

export interface PropertyLinks {
  href: string;
  method: string;
  path: string;
}

export interface PropertyApiResponse {
  items: PropertyListing[];
  _links: {
    self: PropertyLinks;
    first: PropertyLinks;
    last: PropertyLinks;
  };
  _meta: PropertyMeta;
}

export interface LocationResult {
  type: string;
  title: string;
  slug: string;
}

export type SortOption = "price" | "-price" | "createdAt" | "-createdAt";

export interface FilterState {
  location: string;
  locationTitle: string;
  categories: string[];
  types: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

export interface PropertyDetail extends PropertyListing {
  description?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  slug: string;
  image?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  sort: SortOption;
  createdAt: string;
}
