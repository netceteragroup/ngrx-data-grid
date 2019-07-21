import {DataFilter, DataGridColumn, DataItemSort} from '../models';

interface BaseGridPayload {
  name: string;
}

export interface InitGridPayload<T extends object = object> extends BaseGridPayload {
  data: T[];
  activeFilters: DataFilter[];
  activeSorting: DataItemSort[];
  paginationPageSize: number;
  columns: DataGridColumn[];
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

export interface ToggleColumnVisibilityPayload extends BaseGridPayload {
  columnId: string;
}
