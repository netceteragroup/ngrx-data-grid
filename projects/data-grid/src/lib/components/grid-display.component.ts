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
import { SelectionConfig } from '../config';
import { ApplyFilterEvent, DataGridColumnWithId, GridDataSortWithColumnId } from '../models';
import { ColumnsStyle, toColumnsStyle } from '../util/columns-style';

@Component({
  selector: 'ngrx-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent implements OnChanges {
  @Input() selectionConfig: SelectionConfig;
  @Input() columns: DataGridColumnWithId[] = [];
  @Input() gridRows: any[] = [];
  @Input() rowDataIndexes: number[] = [];
  @Input() selectedRowIndexes: number[] = [];
  @Input() checkboxSelection = false;
  @Input() allSelected = false;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();
  @Output() toggleSelectAllRows = new EventEmitter();
  @Output() toggleRow = new EventEmitter();

  columnsStyle: ColumnsStyle;

  ngOnChanges({columns: columnsChanges}: SimpleChanges): void {
    if (columnsChanges && columnsChanges.currentValue !== columnsChanges.previousValue) {
      const columnsStyle = toColumnsStyle(this.columns);
      const selectionStyle = (this.selectionConfig.checkboxSelection) ? '3rem' : '';
      this.columnsStyle = {'grid-template-columns': `${selectionStyle} ${columnsStyle}`};
    }
  }

  trackByIndex(_, index) {
    return index;
  }

  onToggleRow(index: number) {
    this.toggleRow.emit(this.gridRows[index]);
  }

  checkSelected(index: number): boolean {
    const selectedRowIndex = this.rowDataIndexes[index];
    return R.contains(selectedRowIndex, this.selectedRowIndexes);
  }

}
