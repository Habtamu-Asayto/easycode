// import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { GEOGRAPHY_TOKENS } from '../../../shared/constants';

import { IRegionRepository } from '../../../domain/geography/repositories/region.repository';

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

    if (!region) {
      throw new NotFoundException('Region not found');
    }

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(dto: CreateRegionDto) {
    const existing = await this.regionRepo.findByCode(dto.code);

    if (existing) {
      throw new ConflictException('Region code already exists');
    }

    const region = await this.regionRepo.create(dto);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class UpdateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string, dto: UpdateRegionDto) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException('Region not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const codeExists = await this.regionRepo.findByCode(dto.code);

      if (codeExists) {
        throw new Error('Region code already exists');
      }
    }

    const region = await this.regionRepo.update(id, dto);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class DeleteRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException('Region not found');
    }

    await this.regionRepo.softDelete(id);
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
