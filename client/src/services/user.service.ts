import api from "@/lib/axios";
import { 
  User, 
  UserListItem, 
  UpdateUserData, 
  UserProfileResponse,
  UserError 
} from "@/types/user.types";
import { USE_MOCK } from "@/lib/constants";
import { MOCK_USERS } from "@/lib/mockData";
import { AxiosError } from "axios";

// ── Error message mapper ───────────────────────────────────────────────────
function getUserErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    USER_NOT_FOUND: "User not found",
    FORBIDDEN_OPERATION: "You can only update your own profile",
    NO_FIELDS_TO_UPDATE: "No fields provided to update",
    INVALID_EMAIL: "Invalid email format",
    EMAIL_TOO_LONG: "Email is too long",
    EMAIL_ALREADY_EXISTS: "This email is already in use",
    INVALID_USERNAME: "Invalid username format",
    USERNAME_ALREADY_EXISTS: "This username is already taken",
    INVALID_FIRST_NAME_LENGTH: "First name must be between 2-50 characters",
    INVALID_LAST_NAME_LENGTH: "Last name must be between 2-50 characters",
    UNSUPPORTED_LANGUAGE: "Unsupported language",
    GENERAL_ERROR: "An error occurred",
  };

  return errorMessages[code] || "An unexpected error occurred";
}

// ── Mock helper ────────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ── Get All Users ──────────────────────────────────────────────────────────
export async function getAllUsers(): Promise<UserListItem[]> {

  try {
    const response = await api.get<{ success: { data: UserListItem[] } }>("/users");
    return response.data.success.data;
  } catch (error) {
    const axiosError = error as AxiosError<UserError>;
    
    if (axiosError.response?.data?.error) {
      throw new Error(getUserErrorMessage(axiosError.response.data.error.code));
    }
    
    throw new Error("Failed to fetch users");
  }
}

// ── Get User Profile ───────────────────────────────────────────────────────
export async function getUserProfile(userId: string | number): Promise<User> {
  if (USE_MOCK) {
    const user = MOCK_USERS.find((u) => u.id === userId.toString());
    if (!user) throw new Error("User not found");
    return mockDelay(user);
  }

  try {
    console.log("📤 Fetching user profile:", userId);
    
    const response = await api.get<UserProfileResponse>(`/users/${userId}`);
    
    console.log("✅ User profile response:", response.data);
    
    // Convert backend response to User type
    return {
      id: userId,
      username: response.data.username,
      email: response.data.email,
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      profile_picture: response.data.profile_picture,
      preferred_language: response.data.preferred_language,
    };
  } catch (error) {
    console.error("❌ Failed to fetch user profile:", error);
    
    const axiosError = error as AxiosError<UserError>;
    
    console.log("Response status:", axiosError.response?.status);
    console.log("Response data:", axiosError.response?.data);
    
    if (axiosError.response?.data?.error) {
      throw new Error(getUserErrorMessage(axiosError.response.data.error.code));
    }
    
    throw new Error("Failed to fetch user profile");
  }
}

// ── Update User Profile ────────────────────────────────────────────────────
export async function updateUserProfile(
  userId: string | number,
  data: UpdateUserData
): Promise<void> {
  if (USE_MOCK) {
    await mockDelay({ success: { code: "ACCOUNT_UPDATED" } });
    return;
  }

  try {
    console.log("📤 Updating user profile:", userId, data);
    
    // If there's a profile picture, use FormData
    if (data.profile_picture) {
      const formData = new FormData();
      
      // Add all fields except profile_picture
      if (data.email) formData.append("email", data.email);
      if (data.username) formData.append("username", data.username.toLowerCase());
      if (data.first_name) formData.append("first_name", data.first_name);
      if (data.last_name) formData.append("last_name", data.last_name);
      if (data.preferred_language) formData.append("preferred_language", data.preferred_language);
      
      // Add profile picture file
      formData.append("profile_picture", data.profile_picture);

      const response = await api.patch(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("✅ Profile updated (with image):", response.data);
    } else {
      // No file, use JSON
      const payload: Record<string, string> = {};
      if (data.email) payload.email = data.email;
      if (data.username) payload.username = data.username.toLowerCase();
      if (data.first_name) payload.first_name = data.first_name;
      if (data.last_name) payload.last_name = data.last_name;
      if (data.preferred_language) payload.preferred_language = data.preferred_language;

      const response = await api.patch(`/users/${userId}`, payload);
      
      console.log("✅ Profile updated:", response.data);
    }
  } catch (error) {
    console.error("❌ Failed to update profile:", error);
    
    const axiosError = error as AxiosError<UserError>;
    
    console.log("Response status:", axiosError.response?.status);
    console.log("Response data:", axiosError.response?.data);
    
    if (axiosError.response?.data?.error) {
      throw new Error(getUserErrorMessage(axiosError.response.data.error.code));
    }
    
    throw new Error("Failed to update profile");
  }
}

// ── Get Current User (helper) ──────────────────────────────────────────────
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem("hypertube_token");
  if (!token) return null;

  // Decode JWT to get user ID (basic decode, not validation)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id || payload.userId || payload.sub;
    
    if (userId) {
      return await getUserProfile(userId);
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  return null;
}