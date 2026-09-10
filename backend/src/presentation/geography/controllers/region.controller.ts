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
  CreateRegionSchema,
  UpdateRegionSchema,
} from '../../../application/geography/dto';
import type {
  GeographyQueryDto,
  CreateRegionDto,
  UpdateRegionDto,
} from '../../../application/geography/dto';
import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from '../../../application/geography/use-cases';
import { ICurrentUser } from '../../../shared/interfaces';

@Controller('regions')
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
  @Permissions('geography:read')
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getRegions.execute(query);
  }

  @Get('lookup')
  @Permissions('geography:read')
  lookup() {
    return this.lookupRegions.execute();
  }

  @Get(':id')
  @Permissions('geography:read')
  findOne(@Param('id') id: string) {
    return this.getRegion.execute(id);
  }

  @Post()
  @Permissions('geography:create')
  create(
    @Body(new ZodValidationPipe(CreateRegionSchema)) dto: CreateRegionDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createRegion.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('geography:update')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRegionSchema)) dto: UpdateRegionDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateRegion.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('geography:delete')
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.deleteRegion.execute(id, user.id);
  }
}
