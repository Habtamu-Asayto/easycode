import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '../decorators';
import { ZodValidationPipe } from '../../../shared/pipes';
import { AuditQuerySchema } from '../../../application/rbac/dto';
import type { AuditQueryDto } from '../../../application/rbac/dto';
import { GetAuditLogsUseCase } from '../../../application/rbac/use-cases/audit/get-audit-logs.usecase';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

  @Get()
  @Permissions('audit:read')
  @ApiOperation({ summary: 'Get audit logs (paginated)' })
  async findAll(
    @Query(new ZodValidationPipe(AuditQuerySchema)) query: AuditQueryDto,
  ) {
    return this.getAuditLogsUseCase.execute(query);
  }
}
