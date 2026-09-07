export class ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto({ success: true, message, data });
  }

  static error(message: string, errors?: any): ApiResponseDto {
    return new ApiResponseDto({ success: false, message, errors });
  }

  static paginated<T>(data: T[], meta: { page: number; limit: number; total: number }, message = 'Success') {
    const totalPages = Math.ceil(meta.total / meta.limit);
    return new ApiResponseDto({
      success: true,
      message,
      data: {
        items: data,
        meta: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages,
          hasNext: meta.page < totalPages,
          hasPrevious: meta.page > 1,
        },
      } as any,
    });
  }
}
