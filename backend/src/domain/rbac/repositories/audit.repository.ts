export interface IAuditRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ logs: any[]; total: number; page: number; limit: number }>;

  create(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<any>;
}
