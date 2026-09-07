
import { Module } from "@nestjs/common";

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from "../../application/geography/use-cases";

import { PrismaService } from "../../infrastructure/database/prisma/prisma.service";

import { PrismaRegionRepository } from "../../infrastructure/geography/database/repositories/region.repository.impl";

import { RegionController } from "./controllers/region.controller";

import { GEOGRAPHY_TOKENS } from "../../shared/constants";

@Module({
  controllers: [RegionController],

  providers: [
    PrismaService,

    {
      provide: GEOGRAPHY_TOKENS.REGION_REPOSITORY,
      useClass: PrismaRegionRepository,
    },

    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],

  exports: [
    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],
})
export class GeographyModule {}
