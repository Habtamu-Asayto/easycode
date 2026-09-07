import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { regionsApi } from "@/infrastructure/geography/api/geography.api";

import type {
  CreateRegionRequest,
  UpdateRegionRequest,
} from "@/domain/geography/entities";

import type { PaginationQuery } from "@/domain/shared/entities";

const REGION_QUERY_KEY = ["regions"];

type RegionQuery = PaginationQuery & {
  isActive?: boolean;
};

export function useRegions(params?: RegionQuery) {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, params],
    queryFn: () => regionsApi.getAll(params),
  });
}

export function useRegion(id: string) {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, id],
    queryFn: () => regionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRegionRequest) => regionsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRegionRequest;
    }) => regionsApi.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useDeleteRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regionsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useRegionLookup() {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, "lookup"],
    queryFn: () => regionsApi.lookup(),
  });
}
