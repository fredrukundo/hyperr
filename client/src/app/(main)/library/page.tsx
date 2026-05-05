"use client";

import { useState, useCallback } from "react";
import { useInfiniteMovies } from "@/hooks/useInfiniteMovies";
import { MovieFilters } from "@/types/movie.types";
import SearchBar from "@/components/library/SearchBar";
import FilterBar from "@/components/library/FilterBar";
import MovieGrid from "@/components/movie/MovieGrid";
import MovieCardSkeleton from "@/components/movie/MovieCardSkeleton";
import InfiniteScroll from "@/components/library/InfiniteScroll";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Omit<MovieFilters, "search">>({
    sortBy: "name",
    sortOrder: "asc",
  });

  // ── Fetch movies with infinite scroll ─────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
  } = useInfiniteMovies({ search, filters });

  // ── Flatten all pages into one array ───────────────────────────────────
  const allMovies = data?.pages.flatMap((page) => page.movies) ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: Omit<MovieFilters, "search">) => {
      setFilters(newFilters);
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1 truncate">
          {search ? `Results for "${search}"` : "Popular Movies"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {search
            ? "Showing search results from all sources"
            : "Browse the most popular free and legal movies"}
        </p>
      </div>

      {/* ── Search ── */}
      <SearchBar
        value={search}
        onChange={handleSearch}
        placeholder="Search for a movie..."
      />

      {/* ── Filters ── */}
      <FilterBar filters={filters} onChange={handleFiltersChange} />

      {/* ── Results count ── */}
      {!isLoading && allMovies.length > 0 && (
        <p className="text-sm text-muted-foreground font-medium">
          Showing{" "}
          <span className="text-foreground font-bold">{allMovies.length}</span>{" "}
          {allMovies.length === 1 ? "movie" : "movies"}
          {search && (
            <> for <span className="text-[#2872A1] font-bold">"{search}"</span></>
          )}
        </p>
      )}

      {/* ── Error state ── */}
      {isError && (
        <ErrorMessage
          message="Failed to load movies. Please check your connection."
          onRetry={() => refetch()}
        />
      )}

      {/* ── Loading skeletons (first load only) ── */}
      {isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !isError && allMovies.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No movies found"
          description={
            search
              ? `We couldn't find any movies matching "${search}". Try a different search term.`
              : "No movies available right now. Try again later."
          }
          action={
            search ? (
              <button
                onClick={() => handleSearch("")}
                className="bg-[#2872A1] hover:bg-[#1A4A6B] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                Clear Search
              </button>
            ) : undefined
          }
        />
      )}

      {/* ── Movie grid ── */}
      {!isLoading && !isError && allMovies.length > 0 && (
        <MovieGrid movies={allMovies} />
      )}

      {/* ── Infinite scroll trigger ── */}
      {!isLoading && !isError && allMovies.length > 0 && (
        <InfiniteScroll
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}