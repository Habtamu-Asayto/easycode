export class RegionMapper {
  static toResponseDto(region: any) {
    return {
      id: region.id,
      name: region.name,
      code: region.code,
      isActive: region.isActive,
      createdAt: region.createdAt,
      updatedAt: region.updatedAt,
    };
  }

  static toResponseDtoList(regions: any[]) {
    return regions.map((r) =>
      RegionMapper.toResponseDto(r),
    );
  }
}