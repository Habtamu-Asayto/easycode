import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GEOGRAPHY_TOKENS } from '../../../shared/constants';
import { REPOSITORY_TOKENS } from '../../../shared/constants';
import { IWoredaRepository } from '../../../domain/geography/repositories/woreda.repository';
import { IAuditRepository } from '../../../domain/rbac/repositories/audit.repository';
import { WoredaMapper } from '../../../infrastructure/geography/database/entities';
import { PaginationUtil } from '../../../shared/utils';
import { CreateWoredaDto, UpdateWoredaDto, GeographyQueryDto } from '../dto';

@Injectable()
export class GetWoredasUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
  ) {}

  async execute(query: GeographyQueryDto & { zoneId?: string }) {
    const { items, total } = await this.woredaRepo.findAll(query);
    return {
      items: WoredaMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetWoredaUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
  ) {}

  async execute(id: string) {
    const woreda = await this.woredaRepo.findById(id);
    if (!woreda) throw new NotFoundException('Woreda not found');
    return WoredaMapper.toResponseDto(woreda);
  }
}

@Injectable()
export class GetWoredasByZoneUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
  ) {}

  async execute(zoneId: string) {
    const woredas = await this.woredaRepo.findByZone(zoneId);
    return WoredaMapper.toResponseDtoList(woredas);
  }
}

@Injectable()
export class CreateWoredaUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateWoredaDto, userId: string) {
    const woreda = await this.woredaRepo.create(dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'CREATE',
      entity: 'Woreda',
      entityId: woreda.id,
      newValues: dto as any,
    });
    return WoredaMapper.toResponseDto(woreda);
  }
}

@Injectable()
export class UpdateWoredaUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateWoredaDto, userId: string) {
    const existing = await this.woredaRepo.findById(id);
    if (!existing) throw new NotFoundException('Woreda not found');

    const woreda = await this.woredaRepo.update(id, dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'UPDATE',
      entity: 'Woreda',
      entityId: id,
      oldValues: existing,
      newValues: dto as any,
    });
    return WoredaMapper.toResponseDto(woreda);
  }
}

@Injectable()
export class DeleteWoredaUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.WOREDA_REPOSITORY)
    private readonly woredaRepo: IWoredaRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.woredaRepo.findById(id);
    if (!existing) throw new NotFoundException('Woreda not found');

    await this.woredaRepo.softDelete(id, userId);
    await this.auditRepo.create({
      userId,
      action: 'SOFT_DELETE',
      entity: 'Woreda',
      entityId: id,
    });
  }
}