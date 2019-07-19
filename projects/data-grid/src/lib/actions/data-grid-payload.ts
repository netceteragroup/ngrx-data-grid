import {DataFilter} from '../models/grid-filter';
import {DataItemSort} from '../models/grid-sort';

interface BaseGridPayload {
  name: string;
}

export interface InitGridPayload<T extends object = object> extends BaseGridPayload {
  data: T[];
  activeFilters: DataFilter[];
  activeSorting: DataItemSort[];
  paginationPageSize: number;
}

export interface SortGridPayload extends BaseGridPayload {
  sorting: DataItemSort;
}

export interface FilterGridPayload extends BaseGridPayload {
  filter: DataFilter;
}

export interface ChangePageSizePayload extends BaseGridPayload {
  pageSize: number;
}

export interface ChangePageNumberPayload extends BaseGridPayload {
  pageNumber: number;
}

export interface ToggleRowSelectionPayload<T extends object = object> extends BaseGridPayload {
  dataItem: T;
}

export interface ToggleAllRowsSelectionPayload extends BaseGridPayload {
  selectionStatus: boolean;
}
