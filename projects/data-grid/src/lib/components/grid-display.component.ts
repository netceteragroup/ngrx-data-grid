import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { SelectionConfig } from '../config';
import { DataGridColumnWithId } from '../models';
import { getNumberOfVisibleColumns } from '../util/grid-columns';

@Component({
  selector: 'ngrx-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() selectionConfig: SelectionConfig;
  @Input() columns: DataGridColumnWithId[] = [];
  @Input() gridRows: any[] = [];
  @Input() rowDataIndexes: number[] = [];
  @Input() selectedRowIndexes: number[] = [];

  @Output() toggleRow = new EventEmitter();

  get gridColumns() {
    const columnsWidth = R.join(' ', R.map(({width}) => width ? this.getWidth(width)  : 'minmax(150px, 1.4fr)', this.columns));
    const selection = (this.selectionConfig.checkboxSelection) ? '3rem ' : '';
    return {'grid-template-columns': `${selection} ${columnsWidth}`};
  }

  getWidth(width: number) {
    return width < 200 ? `${width}px` : `minmax(150px, ${width}px)`;
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
