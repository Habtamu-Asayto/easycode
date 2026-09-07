import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";

/**
 * BFF API Client
 *
 * All requests go to Next.js API routes (/api/v1/*), which proxy to
 * the NestJS backend. Authentication is handled server-side by the
 * BFF proxy layer — no JWT token management needed on the client.
 */
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Response interceptor - handle 401 (session expired)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      await signOut({ callbackUrl: "/login" });
    }
    return Promise.reject(error);
  },
);

export default api;
