import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
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
  CreateUserSchema, 
  UpdateUserSchema, 
  ResetPasswordSchema, 
  UserQuerySchema,
} from '../../../application/rbac/dto';
import type { UserQueryDto } from '../../../application/rbac/dto';
import type { CreateUserDto } from '../../../application/rbac/dto';
import type { ResetPasswordDto } from '../../../application/rbac/dto';
import type { UpdateUserDto } from '../../../application/rbac/dto';
import { GetUsersUseCase } from '../../../application/rbac/use-cases/users/get-users.usecase';
import { GetUserByIdUseCase } from '../../../application/rbac/use-cases/users/get-user-by-id.usecase';
import { CreateUserUseCase } from '../../../application/rbac/use-cases/users/create-user.usecase';
import { UpdateUserUseCase } from '../../../application/rbac/use-cases/users/update-user.usecase';
import { DeleteUserUseCase } from '../../../application/rbac/use-cases/users/delete-user.usecase';
import { ResetPasswordUseCase } from '../../../application/rbac/use-cases/users/reset-password.usecase';
import { ToggleActiveUseCase } from '../../../application/rbac/use-cases/users/toggle-active.usecase';
import { UnlockUserUseCase } from '../../../application/rbac/use-cases/users/unlock-user.usecase';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly toggleActiveUseCase: ToggleActiveUseCase,
    private readonly unlockUserUseCase: UnlockUserUseCase,
  ) {}

  @Get()
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get all users (paginated)' })
  async findAll(
    @Query(new ZodValidationPipe(UserQuerySchema)) query: UserQueryDto,
  ) {
    return this.getUsersUseCase.execute(query);
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @Permissions('users:create')
  @ApiOperation({ summary: 'Create a new user' })
  async create(
    @Body(new ZodValidationPipe(CreateUserSchema)) dto: CreateUserDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createUserUseCase.execute(dto, user.id);
  }

  @Put(':id')
  @Permissions('users:update')
  @ApiOperation({ summary: 'Update an existing user' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateUserUseCase.execute(id, dto, user.id);
  }

  @Delete(':id')
  @Permissions('users:delete')
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.deleteUserUseCase.execute(id, user.id);
  }

  @Post(':id/reset-password')
  @Permissions('users:manage')
  @ApiOperation({ summary: 'Reset user password (admin only)' })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(ResetPasswordSchema)) dto: ResetPasswordDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    await this.resetPasswordUseCase.execute(id, dto, user.id);
    return { message: 'Password reset successfully' };
  }

  @Patch(':id/unlock')
  @Permissions('users:manage')
  @ApiOperation({ summary: 'Unlock a locked user account' })
  async unlock(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.unlockUserUseCase.execute(id, user.id);
  }

  @Patch(':id/toggle-active')
  @Permissions('users:manage')
  @ApiOperation({ summary: 'Toggle user active status' })
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.toggleActiveUseCase.execute(id, user.id);
  }
}
