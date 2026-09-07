import { z } from 'zod';
import { PaginationQuerySchema } from '../../../shared/dto';

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(100)
    .regex(
      /^[a-z_]+$/,
      'Role name must be lowercase letters and underscores only',
    ),
  displayName: z.string().min(2).max(150),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});

export const UpdateRoleSchema = z.object({
  displayName: z.string().min(2).max(150).optional(),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const RoleQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
export type RoleQueryDto = z.infer<typeof RoleQuerySchema>;

export class RoleResponseDto {
  id!: string;
  name!: string;
  displayName!: string;
  description!: string | null;
  isSystem!: boolean;
  isActive!: boolean;
  permissions!: Array<{
    id: string;
    name: string;
    displayName: string;
    module: string;
    action: string;
  }>;
  userCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
