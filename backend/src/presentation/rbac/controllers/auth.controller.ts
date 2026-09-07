import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger'; 
import { Public, CurrentUser } from '../decorators';
import { ZodValidationPipe } from '../../../shared/pipes';
import { ICurrentUser } from '../../../shared/interfaces';
import{ 
  LoginSchema,
  RefreshTokenSchema, 
  ChangePasswordSchema,
} from '../../../application/rbac/dto';

import { ChangePasswordDto } from '../../../application/rbac/dto';

import { LoginDto } from '../../../application/rbac/dto';
import { LoginUseCase } from '../../../application/rbac/use-cases/auth/login.usecase';
import { RefreshTokensUseCase } from '../../../application/rbac/use-cases/auth/refresh-tokens.usecase';
import { LogoutUseCase } from '../../../application/rbac/use-cases/auth/logout.usecase';
import { ChangePasswordUseCase } from '../../../application/rbac/use-cases/auth/change-password.usecase';
import { GetProfileUseCase } from '../../../application/rbac/use-cases/auth/get-profile.usecase';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.loginUseCase.execute(
      loginDto,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema))
    body: { refreshToken: string },
    @Req() req: Request,
  ) {
    return this.refreshTokensUseCase.execute(
      body.refreshToken,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(
    @CurrentUser('id') userId: string,
    @Body() body: { refreshToken?: string },
  ) {
    await this.logoutUseCase.execute(userId, body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(ChangePasswordSchema)) dto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    await this.changePasswordUseCase.execute(
      userId,
      dto,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
    return { message: 'Password changed successfully' };
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: ICurrentUser) {
    return this.getProfileUseCase.execute(user.id);
  }
}
