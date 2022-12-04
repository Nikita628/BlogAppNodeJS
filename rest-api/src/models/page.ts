export interface IPage<T> {
  total: number;
  items: T[];
}

export interface IPageParam {
  page: number;
  pageSize: number;
}
