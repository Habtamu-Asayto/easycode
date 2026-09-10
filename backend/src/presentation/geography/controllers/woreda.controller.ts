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
  CreateWoredaSchema,
  UpdateWoredaSchema,
} from '../../../application/geography/dto';
import type {
  GeographyQueryDto,
  CreateWoredaDto,
  UpdateWoredaDto,
} from '../../../application/geography/dto';
import {
  GetWoredasUseCase,
  GetWoredaUseCase,
  GetWoredasByZoneUseCase,
  CreateWoredaUseCase,
  UpdateWoredaUseCase,
  DeleteWoredaUseCase,
} from '../../../application/geography/use-cases';
import { ICurrentUser } from '../../../shared/interfaces';

@Controller('woredas')
export class WoredaController {
  constructor(
    private readonly getWoredas: GetWoredasUseCase,
    private readonly getWoreda: GetWoredaUseCase,
    private readonly getWoredasByZone: GetWoredasByZoneUseCase,
    private readonly createWoreda: CreateWoredaUseCase,
    private readonly updateWoreda: UpdateWoredaUseCase,
    private readonly deleteWoreda: DeleteWoredaUseCase,
  ) {}

  @Get()
  @Permissions('geography:read')
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getWoredas.execute(query);
  }

  @Get('by-zone/:zoneId')
  @Permissions('geography:read')
  byZone(@Param('zoneId') zoneId: string) {
    return this.getWoredasByZone.execute(zoneId);
  }

  @Get(':id')
  @Permissions('geography:read')
  findOne(@Param('id') id: string) {
    return this.getWoreda.execute(id);
  }

  @Post()
  @Permissions('geography:create')
  create(
    @Body(new ZodValidationPipe(CreateWoredaSchema)) dto: CreateWoredaDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createWoreda.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('geography:update')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateWoredaSchema)) dto: UpdateWoredaDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateWoreda.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('geography:delete')
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.deleteWoreda.execute(id, user.id);
  }
}