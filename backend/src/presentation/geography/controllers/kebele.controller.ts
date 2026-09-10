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
  CreateKebeleSchema,
  UpdateKebeleSchema,
} from '../../../application/geography/dto';
import type {
  GeographyQueryDto,
  CreateKebeleDto,
  UpdateKebeleDto,
} from '../../../application/geography/dto';
import {
  GetKebelesUseCase,
  GetKebeleUseCase,
  GetKebelesByWoredaUseCase,
  CreateKebeleUseCase,
  UpdateKebeleUseCase,
  DeleteKebeleUseCase,
} from '../../../application/geography/use-cases';
import { ICurrentUser } from '../../../shared/interfaces';

@Controller('kebeles')
export class KebeleController {
  constructor(
    private readonly getKebeles: GetKebelesUseCase,
    private readonly getKebele: GetKebeleUseCase,
    private readonly getKebelesByWoreda: GetKebelesByWoredaUseCase,
    private readonly createKebele: CreateKebeleUseCase,
    private readonly updateKebele: UpdateKebeleUseCase,
    private readonly deleteKebele: DeleteKebeleUseCase,
  ) {}

  @Get()
  @Permissions('geography:read')
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getKebeles.execute(query);
  }

  @Get('by-woreda/:woredaId')
  @Permissions('geography:read')
  byWoreda(@Param('woredaId') woredaId: string) {
    return this.getKebelesByWoreda.execute(woredaId);
  }

  @Get(':id')
  @Permissions('geography:read')
  findOne(@Param('id') id: string) {
    return this.getKebele.execute(id);
  }

  @Post()
  @Permissions('geography:create')
  create(
    @Body(new ZodValidationPipe(CreateKebeleSchema)) dto: CreateKebeleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createKebele.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('geography:update')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateKebeleSchema)) dto: UpdateKebeleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateKebele.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('geography:delete')
  remove(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
    return this.deleteKebele.execute(id, user.id);
  }
}