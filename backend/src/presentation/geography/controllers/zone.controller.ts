import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { Permissions, CurrentUser } from '../../rbac/decorators';
import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import {
  GeographyQuerySchema,
  CreateZoneSchema,
  UpdateZoneSchema,
} from '../../../application/geography/dto';
import type {
  GeographyQueryDto,
  CreateZoneDto,
  UpdateZoneDto,
} from '../../../application/geography/dto';
import {
  GetZonesUseCase,
  GetZoneUseCase,
  GetZonesByRegionUseCase,
  CreateZoneUseCase,
  UpdateZoneUseCase,
  DeleteZoneUseCase,
} from '../../../application/geography/use-cases';
import { ICurrentUser } from '../../../shared/interfaces';

@Controller('zones')
export class ZoneController {
  constructor(
    private readonly getZones: GetZonesUseCase,
    private readonly getZone: GetZoneUseCase,
    private readonly getZonesByRegion: GetZonesByRegionUseCase,
    private readonly createZone: CreateZoneUseCase,
    private readonly updateZone: UpdateZoneUseCase,
    private readonly deleteZone: DeleteZoneUseCase,
  ) {}

  @Get()
  @Permissions('geography:read')
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getZones.execute(query);
  }

  @Get('by-region/:regionId')
  @Permissions('geography:read')
  byRegion(@Param('regionId') regionId: string) {
    return this.getZonesByRegion.execute(regionId);
  }

  @Get(':id')
  @Permissions('geography:read')
  findOne(@Param('id') id: string) {
    return this.getZone.execute(id);
  }

  @Post()
  @Permissions('geography:create')
  create(
    @Body(new ZodValidationPipe(CreateZoneSchema)) dto: CreateZoneDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createZone.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('geography:update')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateZoneSchema)) dto: UpdateZoneDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateZone.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('geography:delete')
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.deleteZone.execute(id, user.id);
  }
}