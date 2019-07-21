export enum SortType {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export interface DataItemSort {
  field: string;
  sortType: SortType;
}

export interface DataItemSortWithValueResolver {
  sorting: DataItemSort;
  valueResolver: any;
}
