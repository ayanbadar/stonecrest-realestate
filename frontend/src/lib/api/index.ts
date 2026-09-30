import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
} from "@/lib/auth/tokens";
import { env } from "@/lib/env";

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      details?: unknown;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

type DrfErrorBody = {
  message?: string;
  detail?: string | Array<{ msg?: string }>;
  code?: string;
  [key: string]: unknown;
};

function extractDrfMessage(data: DrfErrorBody | undefined, fallback: string): string {
  if (!data) return fallback;

  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }

  return fallback;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as DrfErrorBody | undefined;

    return new ApiError(extractDrfMessage(data, error.message || "Request failed"), {
      status,
      code: data?.code,
      details: data,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { cause: error });
  }

  return new ApiError("An unexpected error occurred", { details: error });
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token");
  }

  const { data } = await axios.post<{ access: string; refresh?: string }>(
    `${env.VITE_API_URL}/auth/refresh/`,
    { refresh },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  setAccessToken(data.access);
  if (data.refresh) {
    setTokens(data.access, data.refresh);
  }
  return data.access;
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 30_000,
  });

  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set multipart boundary for FormData uploads.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.set("Content-Type", false);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!(error instanceof AxiosError) || !error.config) {
        return Promise.reject(toApiError(error));
      }

      const config = error.config as RetriableConfig;
      const status = error.response?.status;
      const isAuthUrl = Boolean(
        config.url?.includes("/auth/login/") ||
          config.url?.includes("/auth/logout/") ||
          config.url?.includes("/auth/refresh/") ||
          config.url?.includes("/auth/forgot-password/") ||
          config.url?.includes("/auth/reset-password/"),
      );

      if (status === 401 && !config._retry && !isAuthUrl && getRefreshToken()) {
        config._retry = true;
        try {
          refreshPromise ??= refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
          const access = await refreshPromise;
          config.headers.Authorization = `Bearer ${access}`;
          return client(config);
        } catch {
          clearTokens();
        }
      }

      return Promise.reject(toApiError(error));
    },
  );

  return client;
}

export const api = createApiClient();
