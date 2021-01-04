import { DataGridColumn, FilteringOptions, SortType } from '../models';
import { SelectionType } from '../config';

export interface BaseGridPayload {
  name: string;
}

export interface InitGridPayload<T extends object = object> extends BaseGridPayload {
  data: T[];
  columns: DataGridColumn[];
  paginationPageSize: number;
  parent?: string;
}

export interface SortGridPayload extends BaseGridPayload {
  columnId: string;
  sortType: SortType;
}

export interface FilterGridPayload extends BaseGridPayload {
  columnId: string;
  option: FilteringOptions;
  value: any;
}

export interface ChangePageSizePayload extends BaseGridPayload {
  pageSize: number;
}

export interface ChangePageNumberPayload extends BaseGridPayload {
  pageNumber: number;
}

export interface ToggleRowSelectionPayload<T extends object = object> extends BaseGridPayload {
  dataItem: T;
  selectionType: SelectionType;
}

export interface ToggleAllRowsOnCurrentPageSelectionPayload extends BaseGridPayload {
  selectionStatus: boolean;
}

export interface ToggleColumnVisibilityPayload extends BaseGridPayload {
  columnId: string;
}

type ShouldUpdateGridElement = <T extends object = object>(T) => boolean;
type UpdateGridElement = <T extends object = object>(T) => T;

export interface UpdateGridDataPayload extends BaseGridPayload {
  shouldUpdate: ShouldUpdateGridElement;
  update: UpdateGridElement;
}

export interface ToggleDetailsGridPayload extends BaseGridPayload {
  child: string;
  active: boolean;
}

export interface ReorderColumnPayload extends BaseGridPayload {
  currentIndex: number;
  previousIndex: number;
}

export interface ResizeColumnPayload extends BaseGridPayload {
  columnId: string;
  width: number;
}

export interface DeleteRowByIndexPayload extends BaseGridPayload {
  rowIndex: number;
}

export interface DeleteRowWherePayload<T> extends BaseGridPayload {
  where: (dataItem: T) => boolean;
}
