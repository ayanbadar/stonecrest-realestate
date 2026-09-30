import axios from "axios";

import { api } from "@/lib/api";
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
  setTokens,
} from "@/lib/auth/tokens";
import { env } from "@/lib/env";
import type {
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RefreshResponse,
  ResetPasswordPayload,
  UpdateMePayload,
} from "@/features/auth/types";

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login/", payload);
    setTokens(data.access, data.refresh);
    return data;
  },

  async refresh(): Promise<string> {
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      throw new Error("No refresh token");
    }

    // Bare client — avoids recursive interceptors on the shared api instance.
    const { data } = await axios.post<RefreshResponse>(
      `${env.VITE_API_URL}/auth/refresh/`,
      { refresh },
      { headers: { "Content-Type": "application/json", Accept: "application/json" } },
    );

    setAccessToken(data.access);
    if (data.refresh) {
      setTokens(data.access, data.refresh);
    }
    return data.access;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/auth/me/");
    return data;
  },

  async updateMe(payload: UpdateMePayload): Promise<AuthUser> {
    const { data } = await api.patch<AuthUser>("/auth/me/", payload);
    return data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>(
      "/auth/change-password/",
      payload,
    );
    return data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>(
      "/auth/forgot-password/",
      payload,
    );
    return data;
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>(
      "/auth/reset-password/",
      payload,
    );
    return data;
  },

  async logout(): Promise<MessageResponse | null> {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        const { data } = await api.post<MessageResponse>("/auth/logout/", {
          refresh,
        });
        return data;
      }
      return null;
    } finally {
      clearTokens();
    }
  },
};
