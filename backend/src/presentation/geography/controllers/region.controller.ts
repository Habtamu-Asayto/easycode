
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from "@nestjs/common";

import {
  GeographyQuerySchema,
  CreateRegionSchema,
  UpdateRegionSchema,
} from "../../../application/geography/dto";

import type {
  GeographyQueryDto,
  CreateRegionDto,
  UpdateRegionDto,
} from "../../../application/geography/dto";

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from "../../../application/geography/use-cases";

import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";

@Controller("regions")
export class RegionController {
  constructor(
    private readonly getRegions: GetRegionsUseCase,
    private readonly getRegion: GetRegionUseCase,
    private readonly createRegion: CreateRegionUseCase,
    private readonly updateRegion: UpdateRegionUseCase,
    private readonly deleteRegion: DeleteRegionUseCase,
    private readonly lookupRegions: LookupRegionsUseCase,
  ) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getRegions.execute(query);
  }

  @Get("lookup")
  lookup() {
    return this.lookupRegions.execute();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.getRegion.execute(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateRegionSchema))
    dto: CreateRegionDto,
  ) {
    return this.createRegion.execute(dto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateRegionSchema))
    dto: UpdateRegionDto,
  ) {
    return this.updateRegion.execute(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deleteRegion.execute(id);
  }
}