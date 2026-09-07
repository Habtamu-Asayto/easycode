import api from "./api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/domain/rbac/entities";

export const rolesApi = {
  getAll: async (params?: PaginationQuery & { isActive?: boolean }) => {
    const { data } = await api.get<PaginatedResponse<RoleResponse>>("/roles", {
      params,
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
    return data;
  },

  create: async (payload: CreateRoleRequest) => {
    const { data } = await api.post<ApiResponse<RoleResponse>>(
      "/roles",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateRoleRequest) => {
    const { data } = await api.put<ApiResponse<RoleResponse>>(
      `/roles/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/roles/${id}`);
    return data;
  },
};
