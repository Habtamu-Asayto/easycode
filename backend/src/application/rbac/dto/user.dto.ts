import { z } from 'zod';
import { RBAC_CONSTANTS } from '../../../shared/constants';
import { PaginationQuerySchema } from '../../../shared/dto';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(100)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  password: z
    .string()
    .min(RBAC_CONSTANTS.PASSWORD.MIN_LENGTH)
    .max(RBAC_CONSTANTS.PASSWORD.MAX_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    ),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(20).optional().nullable(),
  mobileNumber: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15)
    .regex(
      /^(\+251|0)[0-9]{9}$/,
      'Valid Ethiopian mobile number required (e.g., +251912345678 or 0912345678)',
    )
    .optional()
    .nullable(),
  isActive: z.boolean().optional().default(true),
  roleIds: z.array(z.string().uuid()).optional().default([]),
  regionId: z.string().uuid().optional().nullable(),
  zoneId: z.string().uuid().optional().nullable(),
  woredaId: z.string().uuid().optional().nullable(),
  kebeleId: z.string().uuid().optional().nullable(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
  username: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  mobileNumber: z
    .string()
    .min(10)
    .max(15)
    .regex(/^(\+251|0)[0-9]{9}$/, 'Valid Ethiopian mobile number required')
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  roleIds: z.array(z.string().uuid()).optional(),
  regionId: z.string().uuid().optional().nullable(),
  zoneId: z.string().uuid().optional().nullable(),
  woredaId: z.string().uuid().optional().nullable(),
  kebeleId: z.string().uuid().optional().nullable(),
});

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(RBAC_CONSTANTS.PASSWORD.MIN_LENGTH)
    .max(RBAC_CONSTANTS.PASSWORD.MAX_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    ),
});

export const UserQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  roleId: z.string().uuid().optional(),
  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
  kebeleId: z.string().uuid().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type UserQueryDto = z.infer<typeof UserQuerySchema>;

export class UserResponseDto {
  id!: string;
  email!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  phone!: string | null;
  mobileNumber!: string | null;
  avatar!: string | null;
  isActive!: boolean;
  isLocked!: boolean;
  lastLoginAt!: Date | null;
  roles!: Array<{ id: string; name: string; displayName: string }>;
  region!: { id: string; name: string } | null;
  zone!: { id: string; name: string } | null;
  woreda!: { id: string; name: string } | null;
  kebele!: { id: string; name: string } | null;
  createdAt!: Date;
  updatedAt!: Date;
}
