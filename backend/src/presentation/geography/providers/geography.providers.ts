import { Provider } from '@nestjs/common';
import { GEOGRAPHY_TOKENS, REPOSITORY_TOKENS } from '../../../shared/constants';

// Infrastructure repository implementations
import {
  PrismaRegionRepository,
  PrismaZoneRepository,
  PrismaWoredaRepository,
  PrismaKebeleRepository,
} from '../../../infrastructure/geography/database/repositories';
import { PrismaAuditRepository } from '../../../infrastructure/rbac/database/repositories/audit.repository.impl';

// Region use cases
import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from '../../../application/geography/use-cases';

// Zone use cases
import {
  GetZonesUseCase,
  GetZoneUseCase,
  GetZonesByRegionUseCase,
  CreateZoneUseCase,
  UpdateZoneUseCase,
  DeleteZoneUseCase,
} from '../../../application/geography/use-cases';

// Woreda use cases
import {
  GetWoredasUseCase,
  GetWoredaUseCase,
  GetWoredasByZoneUseCase,
  CreateWoredaUseCase,
  UpdateWoredaUseCase,
  DeleteWoredaUseCase,
} from '../../../application/geography/use-cases';

// Kebele use cases
import {
  GetKebelesUseCase,
  GetKebeleUseCase,
  GetKebelesByWoredaUseCase,
  CreateKebeleUseCase,
  UpdateKebeleUseCase,
  DeleteKebeleUseCase,
} from '../../../application/geography/use-cases';

/**
 * Repository providers — binds domain interfaces to infrastructure implementations.
 * This is the key DI configuration that enables Clean Architecture's dependency inversion.
 */
export const repositoryProviders: Provider[] = [
  {
    provide: GEOGRAPHY_TOKENS.REGION_REPOSITORY,
    useClass: PrismaRegionRepository,
  },
  {
    provide: GEOGRAPHY_TOKENS.ZONE_REPOSITORY,
    useClass: PrismaZoneRepository,
  },
  {
    provide: GEOGRAPHY_TOKENS.WOREDA_REPOSITORY,
    useClass: PrismaWoredaRepository,
  },
  {
    provide: GEOGRAPHY_TOKENS.KEBELE_REPOSITORY,
    useClass: PrismaKebeleRepository,
  },
  {
    provide: REPOSITORY_TOKENS.AUDIT_REPOSITORY,
    useClass: PrismaAuditRepository,
  },
];

/**
 * All use case providers for the Geography module.
 */
export const useCaseProviders: Provider[] = [
  // Regions
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
  // Zones
  GetZonesUseCase,
  GetZoneUseCase,
  GetZonesByRegionUseCase,
  CreateZoneUseCase,
  UpdateZoneUseCase,
  DeleteZoneUseCase,
  // Woredas
  GetWoredasUseCase,
  GetWoredaUseCase,
  GetWoredasByZoneUseCase,
  CreateWoredaUseCase,
  UpdateWoredaUseCase,
  DeleteWoredaUseCase,
  // Kebeles
  GetKebelesUseCase,
  GetKebeleUseCase,
  GetKebelesByWoredaUseCase,
  CreateKebeleUseCase,
  UpdateKebeleUseCase,
  DeleteKebeleUseCase,
];