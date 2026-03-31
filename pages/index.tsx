import { useRouter } from "next/router";
import { useCallback } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { LayoutGrid, LayoutList } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterBar } from "@/components/filters/FilterBar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { fetchProperties } from "@/lib/api";
import { propertyCache } from "@/lib/propertyCache";
import { queryToFilters, queryToPage, queryToSort, filtersToQuery } from "@/lib/utils";
import { useProperties } from "@/hooks/useProperties";
import { useViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/utils";
import type { FilterState, PropertyListing, PropertyMeta, SortOption } from "@/lib/types";

interface HomeProps {
  initialItems: PropertyListing[];
  initialMeta: PropertyMeta;
  initialFilters: FilterState;
  initialSort: SortOption;
  initialPage: number;
}

export default function Home({ initialItems, initialMeta }: HomeProps) {
  // Seed the client-side cache with SSR data immediately on mount
  propertyCache.set(initialItems);

  const router = useRouter();
  const { viewMode, setViewMode } = useViewMode();

  const filters = queryToFilters(router.query);
  const sort = queryToSort(router.query);
  const page = queryToPage(router.query);

  const { items, meta, isLoading, error, retry } = useProperties({ initialItems, initialMeta });

  const pushFilters = useCallback(
    (nextFilters: FilterState, nextSort: SortOption, nextPage: number) => {
      const query = filtersToQuery(nextFilters, nextPage, nextSort);
      router.push({ pathname: "/", query }, undefined, { shallow: true });
    },
    [router]
  );

  const handleFiltersChange = (nextFilters: FilterState) => pushFilters(nextFilters, sort, 1);
  const handleSortChange = (nextSort: SortOption) => pushFilters(filters, nextSort, 1);
  const handleSearchChange = (name: string) => {
    const query: Record<string, string> = filtersToQuery(filters, 1, sort);
    if (name) query.name = name;
    router.push({ pathname: "/", query }, undefined, { shallow: true });
  };
  const handleClearFilters = () => router.push({ pathname: "/" }, undefined, { shallow: true });
  const handlePageChange = (nextPage: number) => pushFilters(filters, sort, nextPage);

  const totalCount = meta?.totalCount ?? 0;
  const pageCount = meta?.pageCount ?? 1;
  const currentPage = meta?.currentPage ?? page;
  const perPage = meta?.perPage ?? 20;
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalCount);
  const nameValue = typeof router.query.name === "string" ? router.query.name : "";

  return (
    <>
      <Head>
        <title>PropertyGenie — Find Your Dream Home</title>
        <meta name="description" content="Search thousands of properties for sale across Malaysia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <FilterBar
          filters={filters}
          sort={sort}
          searchValue={nameValue}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
        />

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-5 pb-8">

          {/* ── Result count + View toggle ──────────────────────────── */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <p className="text-sm text-gray-500">
              {isLoading ? (
                <span className="text-gray-400">Loading properties…</span>
              ) : totalCount > 0 ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-gray-800">{startItem}–{endItem}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">{totalCount.toLocaleString()}</span>{" "}
                  properties
                </>
              ) : null}
            </p>

            {/* Grid / List toggle */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={cn(
                  "flex items-center justify-center w-8 h-7 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={cn(
                  "flex items-center justify-center w-8 h-7 rounded-md transition-all",
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>

          {/* ── Property grid / list ────────────────────────────────── */}
          <PropertyGrid
            items={items}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onClearFilters={handleClearFilters}
            viewMode={viewMode}
          />

          {/* ── Pagination ──────────────────────────────────────────── */}
          {!isLoading && !error && pageCount > 1 && (
            <div className="mt-12 mb-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                      aria-disabled={currentPage <= 1}
                      className={currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-indigo-50 hover:text-indigo-600"}
                    />
                  </PaginationItem>

                  {buildPageRange(currentPage, pageCount).map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(e) => { e.preventDefault(); handlePageChange(item as number); }}
                          className={
                            item === currentPage
                              ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:text-white"
                              : "hover:bg-indigo-50 hover:text-indigo-600"
                          }
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage < pageCount) handlePageChange(currentPage + 1); }}
                      aria-disabled={currentPage >= pageCount}
                      className={currentPage >= pageCount ? "pointer-events-none opacity-40" : "hover:bg-indigo-50 hover:text-indigo-600"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

function buildPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ query }) => {
  const filters = queryToFilters(query);
  const page = queryToPage(query);
  const sort = queryToSort(query);
  const name = typeof query.name === "string" ? query.name : undefined;

  try {
    const data = await fetchProperties(filters, page, sort, name);
    return {
      props: {
        initialItems: data.items,
        initialMeta: data._meta,
        initialFilters: filters,
        initialSort: sort,
        initialPage: page,
      },
    };
  } catch {
    return {
      props: {
        initialItems: [],
        initialMeta: { totalCount: 0, pageCount: 0, currentPage: 1, perPage: 20 },
        initialFilters: filters,
        initialSort: sort,
        initialPage: page,
      },
    };
  }
};
