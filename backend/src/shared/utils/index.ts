import * as bcrypt from 'bcrypt';
import { RBAC_CONSTANTS } from '../constants';

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, RBAC_CONSTANTS.PASSWORD.SALT_ROUNDS);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export class PaginationUtil {
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static buildMeta(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}

export class StringUtil {
  static generatePermissionName(module: string, action: string): string {
    return `${module}:${action}`;
  }
}
