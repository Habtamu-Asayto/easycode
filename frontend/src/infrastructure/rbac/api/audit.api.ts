import api from "./api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  AuditLogResponse,
  ChangePasswordRequest,
  UserResponse,
} from "@/domain/rbac/entities";

export const auditApi = {
  getAll: async (
    params?: PaginationQuery & {
      userId?: string;
      action?: string;
      entity?: string;
      startDate?: string;
      endDate?: string;
    },
  ) => {
    const { data } = await api.get<PaginatedResponse<AuditLogResponse>>(
      "/audit-logs",
      { params },
    );
    return data;
  },
};

export const authApi = {
  getProfile: async () => {
    const { data } = await api.get<ApiResponse<UserResponse>>("/auth/profile");
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const { data } = await api.post<ApiResponse<null>>(
      "/auth/change-password",
      payload,
    );
    return data;
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse<null>>("/auth/logout");
    return data;
  },
};
