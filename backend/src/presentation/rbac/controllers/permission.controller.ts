import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions, CurrentUser } from '../decorators';
import { ZodValidationPipe } from '../../../shared/pipes';
import type { ICurrentUser } from '../../../shared/interfaces';
import { 
  CreatePermissionSchema, 
  UpdatePermissionSchema, 
  PermissionQuerySchema,
} from '../../../application/rbac/dto';
import type { PermissionQueryDto } from '../../../application/rbac/dto';
import type { UpdatePermissionDto } from '../../../application/rbac/dto';
import type { CreatePermissionDto } from '../../../application/rbac/dto';
import { GetPermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-permissions.usecase';
import { GetActivePermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-active-permissions.usecase';
import { GetGroupedPermissionsUseCase } from '../../../application/rbac/use-cases/permissions/get-grouped-permissions.usecase';
import { GetPermissionModulesUseCase } from '../../../application/rbac/use-cases/permissions/get-permission-modules.usecase';
import { GetPermissionByIdUseCase } from '../../../application/rbac/use-cases/permissions/get-permission-by-id.usecase';
import { CreatePermissionUseCase } from '../../../application/rbac/use-cases/permissions/create-permission.usecase';
import { UpdatePermissionUseCase } from '../../../application/rbac/use-cases/permissions/update-permission.usecase';
import { DeletePermissionUseCase } from '../../../application/rbac/use-cases/permissions/delete-permission.usecase';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly getActivePermissionsUseCase: GetActivePermissionsUseCase,
    private readonly getGroupedPermissionsUseCase: GetGroupedPermissionsUseCase,
    private readonly getPermissionModulesUseCase: GetPermissionModulesUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionByIdUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Get()
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get all permissions (paginated)' })
  async findAll(
    @Query(new ZodValidationPipe(PermissionQuerySchema))
    query: PermissionQueryDto,
  ) {
    return this.getPermissionsUseCase.execute(query);
  }

  @Get('active')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get all active permissions' })
  async findAllActive() {
    return this.getActivePermissionsUseCase.execute();
  }

  @Get('grouped')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permissions grouped by module' })
  async findAllGrouped() {
    return this.getGroupedPermissionsUseCase.execute();
  }

  @Get('modules')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get distinct permission modules' })
  async getModules() {
    return this.getPermissionModulesUseCase.execute();
  }

  @Get(':id')
  @Permissions('permissions:read')
  @ApiOperation({ summary: 'Get permission by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPermissionByIdUseCase.execute(id);
  }

  @Post()
  @Permissions('permissions:create')
  @ApiOperation({ summary: 'Create a new permission' })
  async create(
    @Body(new ZodValidationPipe(CreatePermissionSchema))
    dto: CreatePermissionDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createPermissionUseCase.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('permissions:update')
  @ApiOperation({ summary: 'Update a permission' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdatePermissionSchema))
    dto: UpdatePermissionDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updatePermissionUseCase.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('permissions:delete')
  @ApiOperation({ summary: 'Delete a permission (soft delete)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.deletePermissionUseCase.execute(id, user.id);
  }
}
