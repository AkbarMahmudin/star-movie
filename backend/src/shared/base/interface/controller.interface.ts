import { QueryFilter } from '../../../libs/filters';

export interface IBaseController<TCreate, TUpdate, TViewModel> {
  create(dto: TCreate): Promise<TViewModel>;

  findAll(query: QueryFilter): Promise<{ count: number; data: TViewModel[] }>;

  findOne(id: number | string): Promise<TViewModel>;

  update(id: number | string, dto: TUpdate): Promise<TViewModel>;

  remove(id: number | string): Promise<TViewModel>;
}
