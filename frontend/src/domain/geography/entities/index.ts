export interface RegionResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionRequest {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateRegionRequest {
  name?: string;
  code?: string;
  isActive?: boolean;
}