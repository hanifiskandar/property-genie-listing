# PropertyGenie — Property Search

A premium property listing search results page built with Next.js (Pages Router), shadcn/ui, and Tailwind CSS v4.

## Stack

- **Next.js 16** — Pages Router
- **React 19** with TypeScript (strict)
- **Tailwind CSS v4** + shadcn/ui (Base UI primitives)
- **Inter** font, teal accent (`#0F766E`)

## Getting Started

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

## Project Structure

```
pages/
  index.tsx                  — Main SSR page with getServerSideProps
components/
  layout/Navbar.tsx          — Sticky header with search + saved searches
  filters/
    FilterBar.tsx            — Filter orchestrator
    LocationSearch.tsx       — Autocomplete via /api/locations-mock
    PropertyTypeFilter.tsx   — Multi-select category/type popover
    PriceRangeFilter.tsx     — Dual slider + inputs
    SortSelect.tsx           — Sort dropdown
    ActiveFilterTags.tsx     — Dismissible filter pills
  property/
    PropertyCard.tsx         — Individual listing card
    PropertyGrid.tsx         — Responsive 3-col grid
    SkeletonCard.tsx         — Shimmer loading placeholder
    EmptyState.tsx           — No results state
    ErrorState.tsx           — API error state
  saved-searches/
    SaveSearchDialog.tsx     — Dialog to name + save current filters
    SavedSearchesSheet.tsx   — Slide-in drawer with saved searches
hooks/
  useDebounce.ts             — Generic debounce hook
  useProperties.ts           — Client-side data fetching + state
  useSavedSearches.ts        — localStorage CRUD for saved searches
lib/
  types.ts                   — TypeScript interfaces
  api.ts                     — API functions (fetchProperties, fetchLocations)
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

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/properties-mock` | POST | Search/filter listings |
| `/locations-mock?keyword=` | GET | Location autocomplete |

## Saved Searches

Searches are persisted to `localStorage` under the key `pg_saved_searches`. Open the "Saved" button in the navbar to view, apply, or delete saved searches.
