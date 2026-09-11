export interface RegionResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ZoneResponse {
  id: string;
  name: string;
  code: string;
  regionId: string;
  isActive: boolean;
  region?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface WoredaResponse {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  isActive: boolean;
  zone?: { id: string; name: string; region?: { id: string; name: string } };
  createdAt: string;
  updatedAt: string;
}

export interface KebeleResponse {
  id: string;
  name: string;
  code: string;
  woredaId: string;
  isActive: boolean;

  woreda?: {
    id: string;
    name: string;
    zone?: {
      id: string;
      name: string;
      region?: {
        id: string;
        name: string;
      };
    };
  };

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
export interface CreateZoneRequest {
  name: string;
  code: string;
  regionId: string;
  isActive?: boolean;
}
export interface UpdateZoneRequest {
  name?: string;
  code?: string;
  regionId?: string;
  isActive?: boolean;
}
export interface CreateWoredaRequest {
  name: string;
  code: string;
  zoneId: string;
  isActive?: boolean;
}
export interface UpdateWoredaRequest {
  name?: string;
  code?: string;
  zoneId?: string;
  isActive?: boolean;
}
export interface CreateKebeleRequest {
  name: string;
  code: string;
  woredaId: string;
  isActive?: boolean;
}
export interface UpdateKebeleRequest {
  name?: string;
  code?: string;
  woredaId?: string;
  isActive?: boolean;
}
