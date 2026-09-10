export class KebeleMapper {
  static toResponseDto(kebele: any) {
    return {
      id: kebele.id,
      name: kebele.name,
      code: kebele.code,
      woredaId: kebele.woredaId,
      isActive: kebele.isActive,
      woreda: kebele.woreda
        ? {
            id: kebele.woreda.id,
            name: kebele.woreda.name,
            zone: kebele.woreda.zone
              ? { id: kebele.woreda.zone.id, name: kebele.woreda.zone.name }
              : null,
          }
        : null,
      createdAt: kebele.createdAt,
      updatedAt: kebele.updatedAt,
    };
  }

  static toResponseDtoList(kebeles: any[]) {
    return kebeles.map((k) => KebeleMapper.toResponseDto(k));
  }
}

export const KEBELE_INCLUDE = {
  woreda: {
    select: {
      id: true,
      name: true,
      zone: { select: { id: true, name: true } },
    },
  },
} as const;