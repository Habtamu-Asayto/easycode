import { z } from 'zod';
import { PaginationQuerySchema } from '../../../shared/dto';

export const CreatePermissionSchema = z.object({
  module: z.string().min(2, 'Module is required').max(100),
  action: z.string().min(2, 'Action is required').max(50),
  displayName: z.string().min(2).max(200),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const UpdatePermissionSchema = z.object({
  displayName: z.string().min(2).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const PermissionQuerySchema = PaginationQuerySchema.extend({
  module: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreatePermissionDto = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermissionDto = z.infer<typeof UpdatePermissionSchema>;
export type PermissionQueryDto = z.infer<typeof PermissionQuerySchema>;

export class PermissionResponseDto {
  id!: string;
  name!: string;
  displayName!: string;
  description!: string | null;
  module!: string;
  action!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
