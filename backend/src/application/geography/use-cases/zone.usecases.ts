import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GEOGRAPHY_TOKENS } from '../../../shared/constants';
import { REPOSITORY_TOKENS } from '../../../shared/constants';
import { IZoneRepository } from '../../../domain/geography/repositories/zone.repository';
import { IAuditRepository } from '../../../domain/rbac/repositories/audit.repository';
import { ZoneMapper } from '../../../infrastructure/geography/database/entities';
import { PaginationUtil } from '../../../shared/utils';
import { CreateZoneDto, UpdateZoneDto, GeographyQueryDto } from '../dto';

@Injectable()
export class GetZonesUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
  ) {}

  async execute(query: GeographyQueryDto & { regionId?: string }) {
    const { items, total } = await this.zoneRepo.findAll(query);
    return {
      items: ZoneMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetZoneUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
  ) {}

  async execute(id: string) {
    const zone = await this.zoneRepo.findById(id);
    if (!zone) throw new NotFoundException('Zone not found');
    return ZoneMapper.toResponseDto(zone);
  }
}

@Injectable()
export class GetZonesByRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
  ) {}

  async execute(regionId: string) {
    const zones = await this.zoneRepo.findByRegion(regionId);
    return ZoneMapper.toResponseDtoList(zones);
  }
}

@Injectable()
export class CreateZoneUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateZoneDto, userId: string) {
    const zone = await this.zoneRepo.create(dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'CREATE',
      entity: 'Zone',
      entityId: zone.id,
      newValues: dto as any,
    });
    return ZoneMapper.toResponseDto(zone);
  }
}

@Injectable()
export class UpdateZoneUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateZoneDto, userId: string) {
    const existing = await this.zoneRepo.findById(id);
    if (!existing) throw new NotFoundException('Zone not found');

    const zone = await this.zoneRepo.update(id, dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'UPDATE',
      entity: 'Zone',
      entityId: id,
      oldValues: existing,
      newValues: dto as any,
    });
    return ZoneMapper.toResponseDto(zone);
  }
}

@Injectable()
export class DeleteZoneUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.ZONE_REPOSITORY)
    private readonly zoneRepo: IZoneRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.zoneRepo.findById(id);
    if (!existing) throw new NotFoundException('Zone not found');

    await this.zoneRepo.softDelete(id, userId);
    await this.auditRepo.create({
      userId,
      action: 'SOFT_DELETE',
      entity: 'Zone',
      entityId: id,
    });
  }
}