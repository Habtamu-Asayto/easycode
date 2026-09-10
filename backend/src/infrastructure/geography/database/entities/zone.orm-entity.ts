export class ZoneMapper {
  static toResponseDto(zone: any) {
    return {
      id: zone.id,
      name: zone.name,
      code: zone.code,
      regionId: zone.regionId,
      isActive: zone.isActive,
      region: zone.region
        ? { id: zone.region.id, name: zone.region.name }
        : null,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    };
  }

  static toResponseDtoList(zones: any[]) {
    return zones.map((z) => ZoneMapper.toResponseDto(z));
  }
}

export const ZONE_INCLUDE = {
  region: { select: { id: true, name: true } },
} as const;