export class WoredaMapper {
  static toResponseDto(woreda: any) {
    return {
      id: woreda.id,
      name: woreda.name,
      code: woreda.code,
      zoneId: woreda.zoneId,
      isActive: woreda.isActive,
      zone: woreda.zone
        ? {
            id: woreda.zone.id,
            name: woreda.zone.name,
            region: woreda.zone.region
              ? { id: woreda.zone.region.id, name: woreda.zone.region.name }
              : null,
          }
        : null,
      createdAt: woreda.createdAt,
      updatedAt: woreda.updatedAt,
    };
  }

  static toResponseDtoList(woredas: any[]) {
    return woredas.map((w) => WoredaMapper.toResponseDto(w));
  }
}

export const WOREDA_INCLUDE = {
  zone: {
    select: {
      id: true,
      name: true,
      region: { select: { id: true, name: true } },
    },
  },
} as const;