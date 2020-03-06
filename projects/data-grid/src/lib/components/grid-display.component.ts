import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as R from 'ramda';
import { GridConfig } from '../config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId, ToggleDetailsGridEvent, ToggleRowSelectionEvent } from '../models';
import { ColumnsStyle, toColumnsStyle } from '../util/columns-style';
import { hasValue } from '../util/type';
import { isCheckboxSelection } from '../util/selection';

@Component({
  selector: 'ngrx-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent implements OnChanges {
  @Input() columns: DataGridColumnWithId[] = [];
  @Input() gridRows: any[] = [];
  @Input() rowDataIndexes: number[] = [];
  @Input() selectedRowIndexes: number[] = [];
  @Input() visibleDetailGridIndexes: number[] = [];
  @Input() config: GridConfig;
  @Input() allSelected = false;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() toggleSelectAllRows = new EventEmitter();
  @Output() toggleRow = new EventEmitter<ToggleRowSelectionEvent>();
  @Output() toggleDetails = new EventEmitter<ToggleDetailsGridEvent>();

  columnsStyle: ColumnsStyle;

  get selectionType() {
    return this.config.selection.type;
  }

  ngOnChanges({columns: columnsChanges}: SimpleChanges): void {
    if (columnsChanges && columnsChanges.currentValue !== columnsChanges.previousValue) {
      const columnsStyle = toColumnsStyle(this.columns);
      const masterDetailStyle = this.config.masterDetail ? '3rem ' : '';
      const selectionStyle = hasValue(this.selectionType) ? '3rem ' : '';
      this.columnsStyle = {'grid-template-columns': `${masterDetailStyle}${selectionStyle}${columnsStyle}`};
    }
  }

  trackByIndex(_, index) {
    return index;
  }

  onToggleSelectAllRows() {
    this.toggleSelectAllRows.emit(!this.allSelected);
  }

  hasCheckboxSelection(): boolean {
    return isCheckboxSelection(this.selectionType);
  }

  checkSelected(index: number): boolean {
    return this.isRowSelected(index, this.selectedRowIndexes);
  }

  isDetailGridVisible(index: number): boolean {
    return this.config.masterDetail && this.isRowSelected(index, this.visibleDetailGridIndexes);
  }

  private isRowSelected(index: number, lookUpRowIndexes: number[]): boolean {
    const selectedRowIndex = this.rowDataIndexes[index];
    return R.contains(selectedRowIndex, lookUpRowIndexes);
  }

}
