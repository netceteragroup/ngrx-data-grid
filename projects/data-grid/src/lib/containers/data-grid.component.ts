import * as R from 'ramda';
import {Observable} from 'rxjs';
import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ColumnConfig, GridConfig} from '../config';
import {changePageNumber, changePageSize, initGrid, toggleAllRowsSelection, toggleRowSelection, updateFilters, updateSort} from '../actions/data-grid-actions';
import {getGridDataRows, getGridPagination, getGridSelectedRowIndexes, getGridViewData} from '../store';
import {hasValue} from '../util/type';
import {FilteringOptions} from '../models/grid-filter';
import {DataGridColumn} from '../models/data-grid-column';

@Component({
  selector: 'ngrx-data-grid',
  templateUrl: 'data-grid.component.html'
})
export class DataGridComponent implements OnInit {
  @Input() gridName = 'grid-1';
  @Input() data: any[];
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
    // TODO VV: move init action outside of this component
    this.store.dispatch(initGrid({name: 'grid-1', data: this.data, columns: this.prepareGridColumns(), activeFilters: [], activeSorting: [], paginationPageSize: 5}));
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
    const filterType: any = hasValue(filter) ? R.prop('type')(filter) : null;
    this.store.dispatch(updateFilters({name: this.gridName, filter: {filterType: filterType, field, condition: filterCondition}}));
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

  prepareGridColumns(): DataGridColumn[] {
    return R.map(columnConfig => {
      const {field, headerName, isVisible: visible, sortable: sortAvailable, filter, valueGetter} = columnConfig;
      return {headerName, field, visible, sortAvailable, filterAvailable: hasValue(filter), valueGetter};
    }, this.columnConfig);
  }

}
