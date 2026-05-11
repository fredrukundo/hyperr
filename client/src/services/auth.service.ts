import api from "@/lib/axios";
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  RegisterResponse,
  AuthError 
} from "@/types/auth.types";
import { USE_MOCK } from "@/lib/constants";
import { MOCK_USER } from "@/lib/mockData";
import { AxiosError } from "axios";
import { User } from "@/types/user.types";
import { getCurrentUser } from "./user.service";
import { useAuthStore } from "@/store/auth.store";

const TOKEN_KEY = "hypertube_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = [
      `${TOKEN_KEY}=${token}`,
      `path=/`,
      `max-age=${COOKIE_MAX_AGE}`,
      `SameSite=Lax`,
    ].join("; ");
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// export async function getCurrentUser(): Promise<User> {
//   const response = await api.get<User>("/users/me"); // or your correct endpoint
//   return response.data;
// }

// ── Mock helper ────────────────────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ── Error message mapper ───────────────────────────────────────────────────
function getErrorMessage(code: string, fields?: string[]): string {
  const errorMessages: Record<string, string> = {
    MISSING_FIELDS: `Missing required fields: ${fields?.join(", ")}`,
    INVALID_CREDENTIALS: "Incorrect email/username or password",
    INVALID_EMAIL: "Invalid email format",
    EMAIL_ALREADY_EXISTS: "This email is already registered",
    USERNAME_ALREADY_EXISTS: "This username is already taken",
    INVALID_USERNAME: "Username must be lowercase, 3+ chars, can contain dots (but not at start/end or consecutive)",
    PASSWORD_NOT_MATCH: "Passwords do not match",
    WEAK_PASSWORD: "Password must be at least 6 characters",
    GENERAL_ERROR: "An error occurred. Please try again",
    RESET_LIMIT_REACHED: "Too many reset requests. Please try again later.",
    MISSING_EMAIL: "Email or username is required",
    EXPIRED_SESSION: "Reset link has expired. Please request a new one.",
    INVALID_USER: "User not found",
  };

  return errorMessages[code] || "An unexpected error occurred";
}

// ── Login ──────────────────────────────────────────────────────────────────
export async function login(usernameOrEmail: string, password: string): Promise<AuthResponse> {

  try {
    console.log("📤 Sending login request:", { client: usernameOrEmail });

    const response = await api.post<AuthResponse>("/oauth/token", {
      client: usernameOrEmail,
      secret: password,
    });
    
    console.log("✅ Login response:", response.data);
    const token = response.data.token
    
    saveToken(token);

    const user = await getCurrentUser();

    useAuthStore.getState().login(user, token);
    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    
    const axiosError = error as AxiosError<AuthError>;
    
    if (axiosError.response?.data?.error) {
      const errorData = axiosError.response.data.error;
      throw new Error(getErrorMessage(errorData.code, errorData.fields));
    }
    
    if (axiosError.response?.data) {
      throw new Error(JSON.stringify(axiosError.response.data));
    }
    
    throw new Error(axiosError.message || "An unexpected error occurred");
  }
}

// ── Register ───────────────────────────────────────────────────────────────
export async function register(credentials: RegisterCredentials): Promise<void> {
  if (USE_MOCK) {
    await mockDelay({ success: { code: "REGISTER_SUCCESSED" } });
    return;
  }

  try {
    const payload = {
      username: credentials.username.toLowerCase(),
      email: credentials.email.toLowerCase(),
      first_name: credentials.first_name,
      last_name: credentials.last_name,
      password: credentials.password,
      repassword: credentials.repassword,
    };

    console.log("📤 Sending registration request:", payload);

    const response = await api.post<RegisterResponse>("/users/register", payload);
    
    console.log("✅ Registration response:", response.data);
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    const axiosError = error as AxiosError<AuthError>;
    
    if (axiosError.response?.data?.error) {
      const errorData = axiosError.response.data.error;
      throw new Error(getErrorMessage(errorData.code, errorData.fields));
    }
    
    if (axiosError.response?.data) {
      throw new Error(JSON.stringify(axiosError.response.data));
    }
    
    throw new Error(axiosError.message || "An unexpected error occurred");
  }
}

// ── Request Password Reset (Step 1) ────────────────────────────────────────
export async function requestPasswordReset(emailOrUsername: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    return mockDelay({ message: "IF_EMAIL_USERNAME_EXISTS_RESET_SENT" });
  }

  try {
    console.log("📤 Requesting password reset for:", emailOrUsername);

    const response = await api.post<{ message: string }>(
      "/security/reset-password/request",
      { email_username: emailOrUsername }
    );

    console.log("✅ Reset request response:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Failed to request reset:", error);

    const axiosError = error as AxiosError<AuthError>;

    if (axiosError.response?.data?.error) {
      const code = axiosError.response.data.error.code;
      throw new Error(getErrorMessage(code));
    }

    throw new Error("Failed to request password reset");
  }
}

// ── Confirm Reset Token (Step 2) ───────────────────────────────────────────
export async function confirmResetToken(token: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    return mockDelay({ message: "ALLOW_ACCESS" });
  }

  try {
    console.log("📤 Confirming reset token");

    const response = await api.get<{ message: string }>(
      `/security/reset-password/confirm?token=${encodeURIComponent(token)}`
    );

    console.log("✅ Token confirmed:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Token confirmation failed:", error);

    const axiosError = error as AxiosError<AuthError>;

    if (axiosError.response?.data?.error) {
      const code = axiosError.response.data.error.code;
      throw new Error(getErrorMessage(code));
    }

    throw new Error("Failed to verify reset token");
  }
}

// ── Change Password with Token (Step 3) ────────────────────────────────────
export async function changePasswordWithToken(
  token: string,
  newPassword: string,
  rePassword: string
): Promise<{ message: string }> {
  if (USE_MOCK) {
    return mockDelay({ message: "PASSWORD_RESET_SUCCESS" });
  }

  try {
    console.log("📤 Changing password with token");

    const response = await api.post<{ message: string }>(
      "/security/reset-password/change",
      {
        token,
        new_password: newPassword,
        re_password: rePassword,
      }
    );

    console.log("✅ Password changed:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Password change failed:", error);

    const axiosError = error as AxiosError<AuthError>;

    if (axiosError.response?.data?.error) {
      const code = axiosError.response.data.error.code;
      throw new Error(getErrorMessage(code));
    }

    throw new Error("Failed to reset password");
  }
}

// ── Backward Compatibility Aliases ─────────────────────────────────────────
export const forgotPassword = requestPasswordReset;
export const resetPassword = (token: string, password: string) =>
  changePasswordWithToken(token, password, password);

// ── Logout ─────────────────────────────────────────────────────────────────
export function logout(): void {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}