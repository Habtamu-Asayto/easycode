import api from "./api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  PermissionResponse,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/domain/rbac/entities";

export const permissionsApi = {
  getAll: async (
    params?: PaginationQuery & { isActive?: boolean; module?: string },
  ) => {
    const { data } = await api.get<PaginatedResponse<PermissionResponse>>(
      "/permissions",
      { params },
    );
    return data;
  },

  getActive: async () => {
    const { data } = await api.get<ApiResponse<PermissionResponse[]>>(
      "/permissions/active",
    );
    return data;
  },

  getGrouped: async () => {
    const { data } = await api.get<
      ApiResponse<Record<string, PermissionResponse[]>>
    >("/permissions/grouped");
    return data;
  },

  getModules: async () => {
    const { data } = await api.get<ApiResponse<string[]>>(
      "/permissions/modules",
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<PermissionResponse>>(
      `/permissions/${id}`,
    );
    return data;
  },

  create: async (payload: CreatePermissionRequest) => {
    const { data } = await api.post<ApiResponse<PermissionResponse>>(
      "/permissions",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdatePermissionRequest) => {
    const { data } = await api.put<ApiResponse<PermissionResponse>>(
      `/permissions/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/permissions/${id}`);
    return data;
  },
};
