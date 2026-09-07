import { z } from 'zod';
import { RBAC_CONSTANTS } from '../../../shared/constants';

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username, email, or mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const ForgotPasswordSchema = z.object({
  mobileNumber: z.string().min(10, 'Valid mobile number is required').max(15),
}); 

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(
        RBAC_CONSTANTS.PASSWORD.MIN_LENGTH,
        `Password must be at least ${RBAC_CONSTANTS.PASSWORD.MIN_LENGTH} characters`,
      )
      .max(
        RBAC_CONSTANTS.PASSWORD.MAX_LENGTH,
        `Password must be at most ${RBAC_CONSTANTS.PASSWORD.MAX_LENGTH} characters`,
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginDto = z.infer<typeof LoginSchema>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  };
}
