import { useRouter } from "next/router";
import { useCallback } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";

import { Navbar } from "@/components/layout/Navbar";
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
import {
  queryToFilters,
  queryToPage,
  queryToSort,
  filtersToQuery,
} from "@/lib/utils";
import { useProperties } from "@/hooks/useProperties";
import type { FilterState, PropertyListing, PropertyMeta, SortOption } from "@/lib/types";

interface HomeProps {
  initialItems: PropertyListing[];
  initialMeta: PropertyMeta;
  initialFilters: FilterState;
  initialSort: SortOption;
  initialPage: number;
}

export default function Home({
  initialItems,
  initialMeta,
}: HomeProps) {
  const router = useRouter();

  const filters = queryToFilters(router.query);
  const sort = queryToSort(router.query);
  const page = queryToPage(router.query);

  const { items, meta, isLoading, error, retry } = useProperties({
    initialItems,
    initialMeta,
  });

  const pushFilters = useCallback(
    (nextFilters: FilterState, nextSort: SortOption, nextPage: number) => {
      const query = filtersToQuery(nextFilters, nextPage, nextSort);
      router.push({ pathname: "/", query }, undefined, { shallow: true });
    },
    [router]
  );

  const handleFiltersChange = (nextFilters: FilterState) => {
    pushFilters(nextFilters, sort, 1);
  };

  const handleSortChange = (nextSort: SortOption) => {
    pushFilters(filters, nextSort, 1);
  };

  const handleSearchChange = (name: string) => {
    const query: Record<string, string> = filtersToQuery(filters, 1, sort);
    if (name) query.name = name;
    router.push({ pathname: "/", query }, undefined, { shallow: true });
  };

  const handleClearFilters = () => {
    router.push({ pathname: "/" }, undefined, { shallow: true });
  };

  const handlePageChange = (nextPage: number) => {
    pushFilters(filters, sort, nextPage);
  };

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
        <meta
          name="description"
          content="Search thousands of properties for sale across Malaysia."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[oklch(0.975_0.002_200)]">
        <Navbar searchValue={nameValue} onSearchChange={handleSearchChange} />

        <FilterBar
          filters={filters}
          sort={sort}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Result count */}
          {!isLoading && totalCount > 0 && (
            <p className="text-sm text-gray-500 mb-5">
              Showing{" "}
              <span className="font-semibold text-gray-800">{startItem}–{endItem}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">{totalCount.toLocaleString()}</span>{" "}
              properties
            </p>
          )}

          {/* Property grid */}
          <PropertyGrid
            items={items}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
            onClearFilters={handleClearFilters}
          />

          {/* Pagination */}
          {!isLoading && !error && pageCount > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage <= 1}
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {buildPageRange(currentPage, pageCount).map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(item as number);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pageCount) handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage >= pageCount}
                      className={
                        currentPage >= pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function buildPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  query,
}) => {
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
        initialMeta: {
          totalCount: 0,
          pageCount: 0,
          currentPage: 1,
          perPage: 20,
        },
        initialFilters: filters,
        initialSort: sort,
        initialPage: page,
      },
    };
  }
};
