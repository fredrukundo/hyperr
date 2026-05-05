import api from "@/lib/axios";
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentError,
  CommentResponse,
  CommentsListResponse,
} from "@/types/comment.types";
import { USE_MOCK } from "@/lib/constants";
import { AxiosError } from "axios";

// ── Error message mapper ───────────────────────────────────────────────────
function getCommentErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    COMMENT_NOT_FOUND: "Comment not found",
    MISSING_COMMENT_OR_MOVIE_ID: "Comment text and movie ID are required",
    COMMENT_IS_REQUIRE: "Comment text is required",
    NOT_ALLOWED_OR_NOT_FOUND: "You can only edit/delete your own comments",
    GENERAL_ERROR: "An error occurred",
  };

  return errorMessages[code] || "An unexpected error occurred";
}

// ── Mock helper ────────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ── Get Latest Comments ────────────────────────────────────────────────────
export async function getLatestComments(): Promise<Comment[]> {
  if (USE_MOCK) {
    return mockDelay([]);
  }

  try {
    console.log("📤 Fetching latest comments");

    const response = await api.get<CommentsListResponse>("/comments");

    console.log("✅ Comments response:", response.data);

    return response.data.success.data;
  } catch (error) {
    console.error("❌ Failed to fetch comments:", error);

    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to fetch comments");
  }
}

// ── Get Movie Comments ─────────────────────────────────────────────────────
export async function getMovieComments(movieId: string | number): Promise<Comment[]> {
  if (USE_MOCK) {
    return mockDelay([]);
  }

  try {
    console.log("📤 Fetching comments for movie:", movieId);

    // Backend doesn't have a specific endpoint for movie comments
    // So we fetch all comments and filter (or you can ask backend to add GET /movies/:id/comments)
    const response = await api.get<CommentsListResponse>("/comments");

    // Filter by movie_id (if backend returns it)
    const allComments = response.data.success.data;
    const movieComments = allComments.filter(
      (comment: any) => String(comment.movie_id) === String(movieId)
    );

    console.log(`✅ Found ${movieComments.length} comments for movie ${movieId}`);

    return movieComments;
  } catch (error) {
    console.error("❌ Failed to fetch movie comments:", error);

    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to fetch comments");
  }
}

// ── Get Comment by ID ──────────────────────────────────────────────────────
export async function getComment(commentId: number): Promise<Comment> {
  if (USE_MOCK) {
    throw new Error("Comment not found");
  }

  try {
    const response = await api.get<CommentResponse>(`/comments/${commentId}`);

    return response.data.success.data;
  } catch (error) {
    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to fetch comment");
  }
}

// ── Create Comment ─────────────────────────────────────────────────────────
export async function createComment(data: CreateCommentData): Promise<Comment> {
  if (USE_MOCK) {
    return mockDelay({
      id: Date.now(),
      content: data.comment,
      created_at: new Date().toISOString(),
      username: "You",
      movie_id: Number(data.movie_id),
    });
  }

  try {
    console.log("📤 Creating comment:", data);

    // Ensure movie_id is a number
    const payload = {
      comment: data.comment,
      movie_id: typeof data.movie_id === 'string' 
        ? parseInt(data.movie_id, 10) 
        : data.movie_id,
    };

    console.log("📤 Payload:", payload);

    const response = await api.post<CommentResponse>("/comments", payload);

    console.log("✅ Comment created:", response.data);

    return response.data.success.data;
  } catch (error) {
    console.error("❌ Failed to create comment:", error);

    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to create comment");
  }
}

// ── Update Comment ─────────────────────────────────────────────────────────
export async function updateComment(
  commentId: number,
  data: UpdateCommentData
): Promise<Comment> {
  if (USE_MOCK) {
    return mockDelay({
      id: commentId,
      content: data.comment,
      created_at: new Date().toISOString(),
      username: "You",
    });
  }

  try {
    console.log("📤 Updating comment:", commentId, data);

    const response = await api.patch<CommentResponse>(`/comments/${commentId}`, {
      comment: data.comment,
    });

    console.log("✅ Comment updated:", response.data);

    return response.data.success.data;
  } catch (error) {
    console.error("❌ Failed to update comment:", error);

    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to update comment");
  }
}

// ── Delete Comment ─────────────────────────────────────────────────────────
export async function deleteComment(commentId: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay({ success: true });
    return;
  }

  try {
    console.log("📤 Deleting comment:", commentId);

    await api.delete(`/comments/${commentId}`);

    console.log("✅ Comment deleted");
  } catch (error) {
    console.error("❌ Failed to delete comment:", error);

    const axiosError = error as AxiosError<CommentError>;

    if (axiosError.response?.data?.error) {
      throw new Error(getCommentErrorMessage(axiosError.response.data.error.code));
    }

    throw new Error("Failed to delete comment");
  }
}