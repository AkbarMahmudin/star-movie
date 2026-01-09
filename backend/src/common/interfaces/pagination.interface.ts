export interface IPaginationOptions {
  searchFields?: string[]; // boleh lebih dari satu
  orderField?: string;
  rangeDateField?: string;
  whereCallback?: (where: any) => any; // custom where builder,
  useNowDate?: boolean;
  include?: Record<string, any>;
  select?: Record<string, boolean>;
  omit?: Record<string, boolean>;
}

export interface IResultPaginationOptions {
  skip?: number;
  take?: number;
  where?: any;
  // TODO: change to interface where prisma
  include?: Record<string, any>;
  orderBy?:
    | Record<string, string | { sort: string }>
    | Record<string, string | { sort: string }>[];
  select?: Record<string, boolean>;
  omit?: Record<string, boolean>;
}
