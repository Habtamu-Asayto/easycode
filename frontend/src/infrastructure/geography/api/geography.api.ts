import api from "../../api/api-client";

import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from "@/domain/shared/entities";

import type {
  RegionResponse,
  CreateRegionRequest,
  UpdateRegionRequest,
} from "@/domain/geography/entities";
export const regionsApi = {
  // Boredem
  getAll: async (
  params?: PaginationQuery & {
    isActive?: boolean;
  },
 
): Promise<PaginatedResponse<RegionResponse>> => {
  const { data } = await api.get<PaginatedResponse<RegionResponse>>(
    "/regions",
    {
      params,
    },
  );

  return data;
},

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<RegionResponse>>(
      `/regions/${id}`,
    );

    return data;
  },

  create: async (payload: CreateRegionRequest) => {
    const { data } = await api.post<ApiResponse<RegionResponse>>(
      "/regions",
      payload,
    );

    return data;
  },

  update: async (id: string, payload: UpdateRegionRequest) => {
    const { data } = await api.put<ApiResponse<RegionResponse>>(
      `/regions/${id}`,
      payload,
    );

    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/regions/${id}`);

    return data;
  },

  lookup: async () => {
    const { data } =
      await api.get<ApiResponse<RegionResponse[]>>("/regions/lookup");

    return data.data ?? [];
  },
};
