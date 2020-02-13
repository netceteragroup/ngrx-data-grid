import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import * as R from 'ramda';
import { SelectionConfig, SelectionType } from '../config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId, ToggleRowSelectionEvent } from '../models';
import { ColumnsStyle, toColumnsStyle } from '../util/columns-style';
import { hasValue } from '../util/type';

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
  @Input() selectionType: SelectionType;
  @Input() allSelected = false;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() toggleSelectAllRows = new EventEmitter();
  @Output() toggleRow = new EventEmitter<ToggleRowSelectionEvent>();

  columnsStyle: ColumnsStyle;

  ngOnChanges({columns: columnsChanges}: SimpleChanges): void {
    if (columnsChanges && columnsChanges.currentValue !== columnsChanges.previousValue) {
      const columnsStyle = toColumnsStyle(this.columns);
      const selectionStyle = hasValue(this.selectionType) ? '3rem' : '';
      this.columnsStyle = {'grid-template-columns': `${selectionStyle} ${columnsStyle}`};
    }
  }

  trackByIndex(_, index) {
    return index;
  }

  onToggleRow(index: number) {
    this.toggleRow.emit({dataItem: this.gridRows[index], selectionType: this.selectionType});
  }

  checkSelected(index: number): boolean {
    const selectedRowIndex = this.rowDataIndexes[index];
    return R.contains(selectedRowIndex, this.selectedRowIndexes);
  }

}
