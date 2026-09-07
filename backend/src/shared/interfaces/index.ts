export interface ICurrentUser {
  id: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface IJwtPayload {
  sub: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IPaginatedResult<T> {
  items: T[];
  meta: IPaginationMeta;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

export interface ISortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface IFilterOptions {
  search?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
