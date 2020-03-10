import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { columnValueResolver, DataGridColumnWithId, DetailGridStyle, ToggleDetailsGridEvent, ToggleRowSelectionEvent } from '../../models';
import { GridConfig } from '../../config';
import { hasValue } from '../../util/type';
import * as R from 'ramda';
import { resolveGridName } from '../../util/grid-name-resolver';
import { getVisibleColumns } from '../../util/grid-columns';

@Component({
  selector: 'ngrx-grid-row',
  templateUrl: 'grid-row.component.html',
  styleUrls: ['./grid-row.component.scss']
})
export class GridRowComponent implements OnChanges {
  @Input() data: any;
  @Input() columns: DataGridColumnWithId[];
  @Input() rowIndex: number;
  @Input() config: GridConfig;
  @Input() selected = false;
  @Input()
  @HostBinding('class.ngrx-row-active') active = false;

  @Output() toggleRow = new EventEmitter<ToggleRowSelectionEvent>();
  @Output() toggleDetails = new EventEmitter<ToggleDetailsGridEvent>();

  detailGridStyle: DetailGridStyle;

  get detailGridName() {
    return resolveGridName(this.rowIndex);
  }

  get selectionType() {
    return this.config.selection.type;
  }

  ngOnChanges({columns: columnsChanges}: SimpleChanges): void {
    if (this.config && columnsChanges && columnsChanges.currentValue !== columnsChanges.previousValue) {
      this.detailGridStyle = this.calculateDetailGridStyle();
    }
  }

  trackByIndex(_, index) {
    return index;
  }

  getColumnData(column: DataGridColumnWithId) {
    return columnValueResolver(column)(this.data);
  }

  toggleRowSelection() {
    this.toggleRow.emit({
      dataItem: this.data,
      selectionType: this.selectionType
    });
  }

  onToggleDetails() {
    this.toggleDetails.emit({
      rowData: this.data,
      rowIndex: this.rowIndex,
      active: this.active,
      name: this.detailGridName
    });
  }

  private calculateDetailGridStyle(): DetailGridStyle {
    return {
      'grid-column-start': 1,
      'grid-column-end': this.calculateTotalNumberOfColumns() + 1
    };
  }

  private calculateTotalNumberOfColumns(): number {
    return this.toNumber(this.config.masterDetail) + this.toNumber(hasValue(this.selectionType)) + R.length(getVisibleColumns(this.columns));
  }

  private toNumber(value: boolean): number {
    return value ? 1 : 0;
  }

}
