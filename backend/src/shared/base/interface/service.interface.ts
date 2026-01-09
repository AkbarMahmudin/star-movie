import { IPaginationOptions } from '../../../common/interfaces';
import { QueryFilter } from '../../../libs/filters';

export interface IServiceOptions {
  // authUser?: IAuthenticatedUser;
  query?: QueryFilter;
  pagination?: IPaginationOptions;
  include?: Record<string, any>;
}

export type IServiceSingleOptions = Omit<IServiceOptions, 'pagination'>;
export type IServicePaginationOptions = Omit<
  IServiceOptions,
  'include' | 'query'
>;
