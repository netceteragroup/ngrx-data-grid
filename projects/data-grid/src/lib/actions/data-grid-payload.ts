import { DataGridColumn, FilterCondition, SortType } from '../models';

interface BaseGridPayload {
  name: string;
}

export interface InitGridPayload<T extends object = object> extends BaseGridPayload {
  data: T[];
  columns: DataGridColumn[];
  paginationPageSize: number;
}

export interface SortGridPayload extends BaseGridPayload {
  columnId: string;
  sortType: SortType;
}

export interface FilterGridPayload extends BaseGridPayload {
  columnId: string;
  condition: FilterCondition;
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
