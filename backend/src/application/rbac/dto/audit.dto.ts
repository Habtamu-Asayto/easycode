import { z } from 'zod';
import { PaginationQuerySchema } from '../../../shared/dto';

export const AuditQuerySchema = PaginationQuerySchema.extend({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type AuditQueryDto = z.infer<typeof AuditQuerySchema>;

export class AuditLogResponseDto {
  id!: string;
  userId!: string | null;
  userName!: string | null;
  userEmail!: string | null;
  action!: string;
  entity!: string;
  entityId!: string | null;
  oldValues: any;
  newValues: any;
  ipAddress!: string | null;
  userAgent!: string | null;
  createdAt!: Date;
}
