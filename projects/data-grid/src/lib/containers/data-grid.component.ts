import * as R from 'ramda';
import {Observable} from 'rxjs';
import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ColumnConfig, GridConfig} from '../config';
import {changePageNumber, changePageSize, initGrid, toggleAllRowsSelection, toggleRowSelection, updateFilters, updateSort} from '../actions/data-grid-actions';
import {getGridDataRows, getGridPagination, getGridSelectedRowIndexes, getGridViewData} from '../store';
import {hasValue} from '../util/type';
import {FilteringOptions} from '../models/grid-filter';

@Component({
  selector: 'ngrx-data-grid',
  templateUrl: 'data-grid.component.html'
})
export class DataGridComponent implements OnInit {
  @Input() gridName: string;
  @Input() data: Array<object>;
  @Input() columnConfig: ColumnConfig[];
  @Input() config: GridConfig;

  // TODO VV: remove it with column config refactoring
  selection = {checkboxSelection: true, selectedRowsIds: []};

  viewData$: Observable<object[]>;
  selectedRowIndexes$: Observable<any>;
  pagination$: Observable<any>;
  numberOfRows$: Observable<number>;

  constructor(private store: Store<any>) {
    this.viewData$ = this.store.pipe(select(getGridViewData, {gridName: this.gridName}));
    this.pagination$ = this.store.pipe(select(getGridPagination, {gridName: this.gridName}));
    this.numberOfRows$ = this.store.pipe(select(getGridDataRows, {gridName: this.gridName}));
    this.selectedRowIndexes$ = this.store.pipe(select(getGridSelectedRowIndexes, {gridName: this.gridName}));

    // TODO VV: remove it with column config refactoring
    this.selectedRowIndexes$.subscribe(selectedRowIndexes => {
      this.selection = {checkboxSelection: true, selectedRowsIds: selectedRowIndexes};
    });
  }

  ngOnInit(): void {
    this.store.dispatch(initGrid({name: this.gridName, data: this.data, activeFilters: [], activeSorting: [], paginationPageSize: 5}));
  }

  changePageSize(pageSize: number) {
    this.store.dispatch(changePageSize({name: this.gridName, pageSize}));
  }

  changePageNum(pageNumber: number) {
    this.store.dispatch(changePageNumber({name: this.gridName, pageNumber}));
  }

  onSortGrid({field, sortType}: ColumnConfig) {
    this.store.dispatch(updateSort({name: this.gridName, sorting: {field, sortType}}));
  }

  onFilterGrid({field, filter}: ColumnConfig) {
    // TODO VV: fix it when column config will refactored
    const filterCondition = hasValue(filter) && hasValue(R.prop('condition', filter)) ? {
      option: R.path<FilteringOptions>(['condition', 'filterKey'], filter),
      value: R.path<any>(['condition', 'filterValue'], filter)
    } : null;
    this.store.dispatch(updateFilters({name: this.gridName, filter: {field, condition: filterCondition}}));
  }

  // TODO VV: fix it when column config will be added to store
  // toggleColumn(columnConfigIndex: number) {
  //   this.store.dispatch(toggleColumnVisibility({columnConfigIndex}));
  // }

  onToggleRow(dataItem) {
    this.store.dispatch(toggleRowSelection({name: this.gridName, dataItem}));
  }

  onToggleAllRows(selectionStatus: boolean) {
    this.store.dispatch(toggleAllRowsSelection({name: this.gridName, selectionStatus}));
  }

}
