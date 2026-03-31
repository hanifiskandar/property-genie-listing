# PropertyGenie — Property Search

A property listing search application for the Malaysian market. Users can search, filter, sort, and browse properties for sale. Built with Next.js 16 (Pages Router), shadcn/ui (Base UI primitives), and Tailwind CSS v4.

## Features

- **Property Search & Filtering** — Filter by location (autocomplete), property type/category, price range, and keyword search
- **Sorting** — Sort by earliest created (default), newest first, or price (low→high / high→low)
- **Pagination** — Server-side paginated results with page navigation
- **Grid / List View** — Toggle between card grid and list layout
- **Property Detail** — Click any listing to view full details with map
- **Agent Page** — View all listings by a specific agent
- **Saved Searches** — Save filter combinations to localStorage; apply or delete them from a slide-out drawer
- **SSR + CSR Hybrid** — Initial page is server-rendered for SEO; subsequent filter changes use client-side fetching with skeleton loading
- **Deep-Linkable Filters** — All filter state is reflected in the URL query string; shareable and back-button friendly

## Stack

- **Next.js 16** — Pages Router with Turbopack
- **React 19** with TypeScript (strict)
- **Tailwind CSS v4** + shadcn/ui (Base UI primitives)
- **Leaflet** — Interactive maps on property detail pages
- **localStorage** — Saved searches persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://agents.propertygenie.com.my/api
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm run start
```

### 5. Lint

```bash
npm run lint
```

## Project Structure

```
pages/
  index.tsx                  — Main SSR page with getServerSideProps
  properties/[id].tsx        — Property detail page
  agents/[agentId].tsx       — Agent listings page
  api/
    properties.ts            — Proxy to upstream properties API
    locations.ts             — Proxy to upstream locations API
components/
  layout/Navbar.tsx          — Sticky header with saved searches drawer
  filters/
    FilterBar.tsx            — Filter orchestrator (search, location, type, price, sort)
    LocationSearch.tsx       — Autocomplete location search via /api/locations
    PropertyTypeFilter.tsx   — Multi-select category/type popover
    PriceRangeFilter.tsx     — Dual slider + inputs for min/max price
    SortSelect.tsx           — Sort dropdown
    ActiveFilterTags.tsx     — Dismissible filter pills
  property/
    PropertyCard.tsx         — Grid view listing card
    PropertyListCard.tsx     — List view listing card
    PropertyGrid.tsx         — Responsive grid/list container
    PropertyMap.tsx          — Leaflet map for property detail
    SkeletonCard.tsx         — Shimmer loading placeholder
    EmptyState.tsx           — No results state
    ErrorState.tsx           — API error state
  saved-searches/
    SaveSearchDialog.tsx     — Dialog to name + save current filters
    SavedSearchesSheet.tsx   — Slide-in drawer with saved searches
hooks/
  useDebounce.ts             — Generic debounce hook
  useProperties.ts           — Client-side data fetching + state management
  useSavedSearches.ts        — localStorage CRUD for saved searches (syncs across components)
  useViewMode.ts             — Grid/list view toggle state
lib/
  types.ts                   — TypeScript interfaces
  api.ts                     — API functions (fetchProperties, fetchLocations, findPropertyById, findPropertiesByAgent)
  propertyCache.ts           — Client-side in-memory cache for property detail lookups
  utils.ts                   — Formatters + URL ↔ filter state serialization
```

## Rendering Strategy

### Initial Load — SSR (`getServerSideProps`)

The first page load is server-rendered. `getServerSideProps` reads filter values from the URL query string, calls the mock API as a `POST` request, and returns the property list as props. This means:

- Filters are **deep-linkable** — share any filtered URL and it loads with the correct data
- First paint is **SEO-friendly** — HTML is fully populated before reaching the browser
- **No loading flash** on initial visit

### Filter Changes — CSR (Shallow Routing)

When the user changes a filter, the app uses `router.push(url, undefined, { shallow: true })`. This updates the browser URL without triggering a full server round-trip (i.e. `getServerSideProps` does **not** re-run). Instead, the `useProperties` hook watches `router.query` and fetches data client-side, showing skeleton cards during the transition.

**Benefits:**
- Instant URL update for deep-linking/back-button support
- No full-page reload on filter changes
- Skeleton loading state prevents layout shift

## API

The app proxies requests through Next.js API routes (`pages/api/`) to avoid CORS issues in the browser. Server-side calls (SSR) go directly to the upstream API.

| Local Proxy | Upstream | Method | Purpose |
|-------------|----------|--------|---------|
| `/api/properties` | `/properties-mock` | POST | Search/filter property listings |
| `/api/locations` | `/locations-mock` | GET | Location autocomplete suggestions |

## Saved Searches

Searches are persisted to `localStorage` under the key `pg_saved_searches`. All components using the `useSavedSearches` hook stay in sync via a custom DOM event — saving a search in the filter bar is immediately reflected in the navbar's saved searches drawer without requiring a page refresh.
