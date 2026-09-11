import api from "../../rbac/api/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from "@/domain/shared/entities";
import type {
  RegionResponse,
  ZoneResponse,
  WoredaResponse,
  KebeleResponse,
  CreateRegionRequest,
  UpdateRegionRequest,
  CreateZoneRequest,
  UpdateZoneRequest,
  CreateWoredaRequest,
  UpdateWoredaRequest,
  CreateKebeleRequest,
  UpdateKebeleRequest,
} from "@/domain/geography/entities";

// ── Regions ──────────────────────────────────────────────────────────────────
export const regionsApi = {
  getAll: async (params?: PaginationQuery & { isActive?: boolean }) => {
    const { data } = await api.get<PaginatedResponse<RegionResponse>>(
      "/regions",
      { params },
    );

    return {
      data: data.items,
      meta: data.meta,
    };
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

  /** Lookup: all active regions for dropdowns */
  lookup: async () => {
    const { data } = await api.get<PaginatedResponse<RegionResponse>>(
      "/regions",
      { params: { limit: 100, isActive: true } },
    );
    return data.items ?? [];
  },
};

// ── Zones ────────────────────────────────────────────────────────────────────
export const zonesApi = {
  getAll: async (
    params?: PaginationQuery & { isActive?: boolean; regionId?: string },
  ) => {
    const { data } = await api.get<PaginatedResponse<ZoneResponse>>("/zones", {
      params,
    });
    return {
      data: data.items,
      meta: data.meta,
    };
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<ZoneResponse>>(`/zones/${id}`);
    return data;
  },

  create: async (payload: CreateZoneRequest) => {
    const { data } = await api.post<ApiResponse<ZoneResponse>>(
      "/zones",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateZoneRequest) => {
    const { data } = await api.put<ApiResponse<ZoneResponse>>(
      `/zones/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/zones/${id}`);
    return data;
  },

  /** Lookup: all active zones for dropdowns */
  lookup: async () => {
    const { data } = await api.get<PaginatedResponse<ZoneResponse>>("/zones", {
      params: {
        limit: 100,
        isActive: true,
      },
    });

    return data.items ?? [];
  },

  /** Lookup: zones by region for dropdowns */
  byRegion: async (regionId: string) => {
    const { data } = await api.get<ZoneResponse[]>(
      `/zones/by-region/${regionId}`,
    );

    return data ?? [];
  },
};

// ── Woredas ──────────────────────────────────────────────────────────────────
export const woredasApi = {
  getAll: async (
    params?: PaginationQuery & {
      isActive?: boolean;
      zoneId?: string;
    },
  ) => {
    const { data } = await api.get<PaginatedResponse<WoredaResponse>>(
      "/woredas",
      { params },
    );

    return {
      data: data.items,
      meta: data.meta,
    };
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<WoredaResponse>>(
      `/woredas/${id}`,
    );
    return data;
  },

  create: async (payload: CreateWoredaRequest) => {
    const { data } = await api.post<ApiResponse<WoredaResponse>>(
      "/woredas",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateWoredaRequest) => {
    const { data } = await api.put<ApiResponse<WoredaResponse>>(
      `/woredas/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/woredas/${id}`);
    return data;
  },

  /** Lookup: woredas by zone for dropdowns */
  byZone: async (zoneId: string) => {
    const { data } = await api.get<WoredaResponse[]>(
      `/woredas/by-zone/${zoneId}`,
    );
    return data ?? [];
  },
};

// ── Kebeles ──────────────────────────────────────────────────────────────────
export const kebelesApi = {
  getAll: async (
    params?: PaginationQuery & { isActive?: boolean; woredaId?: string },
  ) => {
    const { data } = await api.get<PaginatedResponse<KebeleResponse>>(
      "/kebeles",
      { params },
    );
    return {
      data: data.items,
      meta: data.meta,
    };
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<KebeleResponse>>(
      `/kebeles/${id}`,
    );
    return data;
  },

  create: async (payload: CreateKebeleRequest) => {
    const { data } = await api.post<ApiResponse<KebeleResponse>>(
      "/kebeles",
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateKebeleRequest) => {
    const { data } = await api.put<ApiResponse<KebeleResponse>>(
      `/kebeles/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/kebeles/${id}`);
    return data;
  },

  /** Lookup: kebeles by woreda for dropdowns */
  byWoreda: async (woredaId: string) => {
    const { data } = await api.get<KebeleResponse[]>(
      `/kebeles/by-woreda/${woredaId}`,
    );
    return data ?? [];
  },
};
