import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as R from 'ramda';
import { GridConfig } from '../config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId, ToggleDetailsGridEvent, ToggleRowSelectionEvent } from '../models';
import { ColumnsStyle, toColumnsStyle } from '../util/columns-style';
import { hasValue } from '../util/type';
import { isCheckboxSelection } from '../util/selection';
import { resolveGridName } from '../util/grid-name-resolver';
import { DragDropEvent } from '../models/drag-drop-event';
import { ColumnResizeEvent } from '../models/column-resize-event';
import { updateColumnWidth } from '../util/grid-columns';

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
  @Input() children: string[] = [];
  @Input() config: GridConfig;
  @Input() allSelected = false;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() toggleSelectAllRowsOnCurrentPage = new EventEmitter();
  @Output() toggleRow = new EventEmitter<ToggleRowSelectionEvent>();
  @Output() toggleDetails = new EventEmitter<ToggleDetailsGridEvent>();
  @Output() dropColumn = new EventEmitter<DragDropEvent>();
  @Output() columnResized = new EventEmitter<ColumnResizeEvent>();

  columnsStyle: ColumnsStyle;

  get selectionType() {
    return this.config.selection.type;
  }

  ngOnChanges({columns: columnsChanges}: SimpleChanges): void {
    if (columnsChanges && columnsChanges.currentValue !== columnsChanges.previousValue) {
      this.setColumnsStyle(this.columns);
    }
  }

  trackByIndex(_, index) {
    return index;
  }

  onToggleSelectAllRowsOnCurrentPage() {
    this.toggleSelectAllRowsOnCurrentPage.emit(!this.allSelected);
  }

  hasCheckboxSelection(): boolean {
    return isCheckboxSelection(this.selectionType);
  }

  checkSelected(index: number): boolean {
    return this.isRowSelected(index, this.selectedRowIndexes);
  }

  isDetailGridVisible(index: number): boolean {
    const rowIndex = this.rowDataIndexes[index];
    return this.config.masterDetail && R.includes(resolveGridName(rowIndex), this.children);
  }

  onDrop({currentIndex, previousIndex}) {
    this.dropColumn.emit({currentIndex, previousIndex});
  }

  onColumnResizing({columnId, width}) {
    this.setColumnsStyle(updateColumnWidth(columnId, width, this.columns));
  }

  private isRowSelected(index: number, lookUpRowIndexes: number[]): boolean {
    const selectedRowIndex = this.rowDataIndexes[index];
    return R.includes(selectedRowIndex, lookUpRowIndexes);
  }

  private setColumnsStyle(columns: DataGridColumnWithId[]) {
    const columnsStyle = toColumnsStyle(columns);
    const masterDetailStyle = this.config.masterDetail ? '3rem ' : '';
    const selectionStyle = hasValue(this.selectionType) ? '3rem ' : '';
    this.columnsStyle = {'grid-template-columns': `${masterDetailStyle}${selectionStyle}${columnsStyle}`};
  }
}
