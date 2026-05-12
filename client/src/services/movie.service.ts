import api from "@/lib/axios";
import { API_URL, USE_MOCK } from "@/lib/constants";
import {
  Movie,
  MovieWithEngine,
  MovieEngine,
  MoviesParams,
  MovieError,
  Subtitle,
} from "@/types/movie.types";
import { MOCK_MOVIES } from "@/lib/mockData";
import { AxiosError } from "axios";

// ── Error message mapper ───────────────────────────────────────────────────
function getMovieErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    ENGINE_MOST_BE_AVAILABLE: "Invalid engine parameter. Use archive or yts.",
    MOVIE_NOT_FOUND: "Movie not found.",
    MOVIE_IS_MISSING_SOME_PART: "Movie data is incomplete.",
    GENERAL_ERROR: "An error occurred while fetching movies.",
  };

  return errorMessages[code] || "An unexpected error occurred.";
}

// ── Mock helper ────────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((v) => String(v).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSubtitles(value: unknown): Subtitle[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((sub: any) => {
        if (typeof sub === "string") {
          return { language: sub, url: "" };
        }

        return {
          language: sub.language || sub.lang || "en",
          url: sub.url || sub.path || "",
          label: sub.label,
        };
      })
      .filter((sub) => sub.language);
  }

  return [];
}

// Important: backend returns { page, limit, results: [...] }
function extractResults(data: any): any[] {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

function normalizeEngine(value: unknown, fallback: MovieEngine): MovieEngine {
  return value === "archive" || value === "yts" ? value : fallback;
}

export function normalizeMovie(raw: any, fallbackEngine: MovieEngine): MovieWithEngine {
  const engine = normalizeEngine(raw.engine || raw.api, fallbackEngine);

  const id = raw.id ?? raw.identifier;
  const title = raw.title ?? raw.name ?? "Untitled";

  const rating = toNumber(raw.rating ?? raw.imdb_rating) ?? 0;
  const year = toNumber(raw.year);
  const length = toNumber(raw.length ?? raw.runtime);

  const genres = toStringArray(raw.genre ?? raw.genres);
  const cast = toStringArray(raw.cast ?? raw.main_cast);

  const coverImage = raw.coverImage ?? raw.cover_image ?? raw.cover ?? null;

  const subtitles = normalizeSubtitles(raw.subtitles ?? raw.subtitle);

  return {
    ...raw,

    id,
    api: raw.api ?? engine,
    engine,
    identifier: raw.identifier ? String(raw.identifier) : undefined,

    title,
    year,
    length,

    imdb_rating: rating,
    rating,

    cover_image: coverImage,
    coverImage,

    genre: genres,
    genres,

    main_cast: raw.main_cast ?? cast.join(", "),
    cast,

    subtitles,

    watched: Boolean(
      raw.watched ||
        raw.is_watched ||
        raw.status === "watched"
    ),
  };
}

function applyClientFilters(
  movies: MovieWithEngine[],
  params: MoviesParams
): MovieWithEngine[] {
  const filters = params.filters ?? {};
  let result = [...movies];

  const genre = filters.genre;
  if (genre && genre !== "all") {
    result = result.filter((movie) =>
      movie.genre?.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  const sortBy = params.sortBy ?? filters.sortBy ?? filters.sort;

  if (sortBy === "name") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortBy === "year") {
    result.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
  }

  if (sortBy === "rating") {
    result.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
  }

  return result;
}

// ── Get Movies List ────────────────────────────────────────────────────────
export async function getMovies(params: MoviesParams = {}): Promise<MovieWithEngine[]> {
  if (USE_MOCK) {
    return mockDelay(
      MOCK_MOVIES.map((m: any) => normalizeMovie(m, "yts"))
    );
  }

  try {
    const filters = params.filters ?? {};

    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const search = params.search?.trim();

    const sortBy = params.sortBy ?? filters.sortBy ?? filters.sort;
    const year = params.year ?? toNumber(filters.year);
    const minRating =
      params.minRating ?? toNumber(filters.minRating ?? filters.rating);

    const queryParams = new URLSearchParams();

    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));

    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (year) queryParams.append("year", String(year));
    if (minRating) queryParams.append("minRating", String(minRating));

    console.log("📤 Fetching movies:", params);

    const response = await api.get<any>(`/movies?${queryParams.toString()}`);

    console.log("✅ Movies response:", response.data);
    console.log("Archive data:", response.data.success.data.archive);
    console.log("YTS data:", response.data.success.data.yts);

    const archiveRaw = extractResults(response.data.success.data.archive);
    const ytsRaw = extractResults(response.data.success.data.yts);

    const archiveMovies = archiveRaw.map((movie) =>
      normalizeMovie(movie, "archive")
    );

    const ytsMovies = ytsRaw.map((movie) =>
      normalizeMovie(movie, "yts")
    );

    let combined = [...archiveMovies, ...ytsMovies];

    combined = applyClientFilters(combined, params);

    console.log(
      `Found ${archiveMovies.length} archive movies, ${ytsMovies.length} YTS movies`
    );

    return combined;
  } catch (error) {
    console.error("❌ Failed to fetch movies:", error);

    const axiosError = error as AxiosError<MovieError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getMovieErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to fetch movies.");
  }
}

// ── Search Movies ──────────────────────────────────────────────────────────
export async function searchMovies(keyword: string): Promise<MovieWithEngine[]> {
  if (USE_MOCK) {
    const filtered = MOCK_MOVIES.filter((m: any) =>
      m.title.toLowerCase().includes(keyword.toLowerCase())
    );

    return mockDelay(filtered.map((m: any) => normalizeMovie(m, "yts")));
  }

  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  try {
    const response = await api.get<any>(
      `/movies/search?keyword=${encodeURIComponent(keyword.trim())}`
    );

    const data = response.data.success.data;

    if (!data) return [];

    // In case backend returns archive/yts grouped search later
    if (data.archive || data.yts) {
      const archiveMovies = extractResults(data.archive).map((m) =>
        normalizeMovie(m, "archive")
      );

      const ytsMovies = extractResults(data.yts).map((m) =>
        normalizeMovie(m, "yts")
      );

      return [...archiveMovies, ...ytsMovies];
    }

    const results = extractResults(data);

    return results.map((movie: any) =>
      normalizeMovie(movie, normalizeEngine(movie.api, "yts"))
    );
  } catch (error) {
    console.error("❌ Search failed:", error);

    const axiosError = error as AxiosError<MovieError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getMovieErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Search failed.");
  }
}

// ── Get Movie Details ──────────────────────────────────────────────────────
export async function getMovieDetails(
  movieId: string | number,
  engine: MovieEngine
): Promise<MovieWithEngine> {
  if (USE_MOCK) {
    const movie = MOCK_MOVIES.find((m: any) => String(m.id) === String(movieId));
    if (!movie) throw new Error("Movie not found");
    return mockDelay(normalizeMovie(movie, engine));
  }

  try {
    const response = await api.get<any>(`/movies/${movieId}?engine=${engine}`);

    return normalizeMovie(response.data, engine);
  } catch (error) {
    console.error("❌ Failed to fetch movie details:", error);

    const axiosError = error as AxiosError<MovieError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getMovieErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to fetch movie details.");
  }
}

// ── Stream URL ─────────────────────────────────────────────────────────────
// Confirm this route with your teammate if video does not play.
export function getStreamUrl(
  movieId: string | number,
  engine: MovieEngine = "yts"
): string {
  const base = API_URL.replace(/\/$/, "");
  ///movies/live/${movieId}/stream
  const token = localStorage.getItem("hypertube_token");

  return `${base}/movies/live/${movieId}/stream?token=${token}`;
}

// ── Mark as watched ────────────────────────────────────────────────────────
// If backend has another endpoint for this, adjust later.
export async function markMovieAsWatched(
  movieId: string | number,
  engine: MovieEngine = "yts"
): Promise<void> {
  try {
    await api.post(`/movies/${movieId}/watch`, { engine });
  } catch (error) {
    // Do not break the player if this endpoint is not ready.
    console.warn("Could not mark movie as watched:", error);
  }
}