import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GEOGRAPHY_TOKENS } from '../../../shared/constants';
import { REPOSITORY_TOKENS } from '../../../shared/constants';
import { IKebeleRepository } from '../../../domain/geography/repositories/kebele.repository';
import { IAuditRepository } from '../../../domain/rbac/repositories/audit.repository';
import { KebeleMapper } from '../../../infrastructure/geography/database/entities';
import { PaginationUtil } from '../../../shared/utils';
import { CreateKebeleDto, UpdateKebeleDto, GeographyQueryDto } from '../dto';

@Injectable()
export class GetKebelesUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
  ) {}

  async execute(query: GeographyQueryDto & { woredaId?: string }) {
    const { items, total } = await this.kebeleRepo.findAll(query);
    return {
      items: KebeleMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetKebeleUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
  ) {}

  async execute(id: string) {
    const kebele = await this.kebeleRepo.findById(id);
    if (!kebele) throw new NotFoundException('Kebele not found');
    return KebeleMapper.toResponseDto(kebele);
  }
}

@Injectable()
export class GetKebelesByWoredaUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
  ) {}

  async execute(woredaId: string) {
    const kebeles = await this.kebeleRepo.findByWoreda(woredaId);
    return KebeleMapper.toResponseDtoList(kebeles);
  }
}

@Injectable()
export class CreateKebeleUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(dto: CreateKebeleDto, userId: string) {
    const kebele = await this.kebeleRepo.create(dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'CREATE',
      entity: 'Kebele',
      entityId: kebele.id,
      newValues: dto as any,
    });
    return KebeleMapper.toResponseDto(kebele);
  }
}

@Injectable()
export class UpdateKebeleUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, dto: UpdateKebeleDto, userId: string) {
    const existing = await this.kebeleRepo.findById(id);
    if (!existing) throw new NotFoundException('Kebele not found');

    const kebele = await this.kebeleRepo.update(id, dto, userId);
    await this.auditRepo.create({
      userId,
      action: 'UPDATE',
      entity: 'Kebele',
      entityId: id,
      oldValues: existing,
      newValues: dto as any,
    });
    return KebeleMapper.toResponseDto(kebele);
  }
}

@Injectable()
export class DeleteKebeleUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.KEBELE_REPOSITORY)
    private readonly kebeleRepo: IKebeleRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.kebeleRepo.findById(id);
    if (!existing) throw new NotFoundException('Kebele not found');

    await this.kebeleRepo.softDelete(id, userId);
    await this.auditRepo.create({
      userId,
      action: 'SOFT_DELETE',
      entity: 'Kebele',
      entityId: id,
    });
  }
}