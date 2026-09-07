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
  CreateRoleSchema, 
  UpdateRoleSchema,
  RoleQuerySchema,
} from '../../../application/rbac/dto';
import type { RoleQueryDto } from '../../../application/rbac/dto';
import type { CreateRoleDto } from '../../../application/rbac/dto';
import type { UpdateRoleDto } from '../../../application/rbac/dto';
import { GetRolesUseCase } from '../../../application/rbac/use-cases/roles/get-roles.usecase';
import { GetRoleByIdUseCase } from '../../../application/rbac/use-cases/roles/get-role-by-id.usecase';
import { CreateRoleUseCase } from '../../../application/rbac/use-cases/roles/create-role.usecase';
import { UpdateRoleUseCase } from '../../../application/rbac/use-cases/roles/update-role.usecase';
import { DeleteRoleUseCase } from '../../../application/rbac/use-cases/roles/delete-role.usecase';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get()
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get all roles (paginated)' })
  async findAll(
    @Query(new ZodValidationPipe(RoleQuerySchema)) query: RoleQueryDto,
  ) {
    return this.getRolesUseCase.execute(query);
  }

  @Get(':id')
  @Permissions('roles:read')
  @ApiOperation({ summary: 'Get role by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getRoleByIdUseCase.execute(id);
  }

  @Post()
  @Permissions('roles:create')
  @ApiOperation({ summary: 'Create a new role' })
  async create(
    @Body(new ZodValidationPipe(CreateRoleSchema)) dto: CreateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createRoleUseCase.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('roles:update')
  @ApiOperation({ summary: 'Update an existing role' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateRoleSchema)) dto: UpdateRoleDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateRoleUseCase.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('roles:delete')
  @ApiOperation({ summary: 'Delete a role (soft delete)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.deleteRoleUseCase.execute(id, user.id);
  }
}
