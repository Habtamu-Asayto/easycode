/** Injection tokens for geography repository interfaces */
export const GEOGRAPHY_TOKENS = {
  REGION_REPOSITORY: Symbol('IRegionRepository'),
  ZONE_REPOSITORY: Symbol('IZoneRepository'),
  WOREDA_REPOSITORY: Symbol('IWoredaRepository'),
  KEBELE_REPOSITORY: Symbol('IKebeleRepository'),
} as const;
  