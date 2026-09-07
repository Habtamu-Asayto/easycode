import api from "./api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
} from "@/domain/rbac/entities";

export const usersApi = {
  getAll: async (
    params?: PaginationQuery & { isActive?: boolean; roleId?: string },
  ) => {
    const { data } = await api.get<PaginatedResponse<UserResponse>>("/users", {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserRequest) => {
    const { data } = await api.post<ApiResponse<UserResponse>>(
      "/users",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateUserRequest) => {
    const { data } = await api.put<ApiResponse<UserResponse>>(
      `/users/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return data;
  },

  resetPassword: async (id: string, payload: ResetPasswordRequest) => {
    const { data } = await api.post<ApiResponse<null>>(
      `/users/${id}/reset-password`,
      payload,
    );
    return data;
  },

  unlock: async (id: string) => {
    const { data } = await api.patch<ApiResponse<UserResponse>>(
      `/users/${id}/unlock`,
    );
    return data;
  },

  toggleActive: async (id: string) => {
    const { data } = await api.patch<ApiResponse<UserResponse>>(
      `/users/${id}/toggle-active`,
    );
    return data;
  },
};
