import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GEOGRAPHY_TOKENS } from '../../../shared/constants';
import { REPOSITORY_TOKENS } from '../../../shared/constants';
import { IRegionRepository } from '../../../domain/geography/repositories/region.repository';
import { IAuditRepository } from '../../../domain/rbac/repositories/audit.repository';
import { RegionMapper } from '../../../infrastructure/geography/database/entities';
import { PaginationUtil } from '../../../shared/utils';
import { CreateRegionDto, UpdateRegionDto, GeographyQueryDto } from '../dto';

@Injectable()
export class GetRegionsUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(query: GeographyQueryDto) {
    const { items, total } = await this.regionRepo.findAll(query);
    return {
      items: RegionMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string) {
    const region = await this.regionRepo.findById(id);
    if (!region) throw new NotFoundException('Region not found');
    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateRegionDto, userId: string) {
    const region = await this.regionRepo.create(dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'CREATE',
      entity: 'Region',
      entityId: region.id,
      newValues: dto as any,
    });
    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class UpdateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateRegionDto, userId: string) {
    const existing = await this.regionRepo.findById(id);
    if (!existing) throw new NotFoundException('Region not found');

    const region = await this.regionRepo.update(id, dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'UPDATE',
      entity: 'Region',
      entityId: id,
      oldValues: existing,
      newValues: dto as any,
    });
    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class DeleteRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.regionRepo.findById(id);
    if (!existing) throw new NotFoundException('Region not found');

    await this.regionRepo.softDelete(id, userId);
    await this.auditRepo.create({
      userId,
      action: 'SOFT_DELETE',
      entity: 'Region',
      entityId: id,
    });
  }
}

@Injectable()
export class LookupRegionsUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute() {
    return this.regionRepo.lookup();
  }
}