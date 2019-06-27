import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnConfig, SortType } from '@grid/config/column-config';
import * as R from 'ramda';

const getArrowClass = R.cond([[R.equals('ASC'), R.always('arrow-up')], [R.equals('DESC'), R.always('arrow-down')], [R.T, R.always('')]]);

@Component({
  selector: 'pcs-grid-header',
  templateUrl: 'grid-header.component.html',
  styleUrls: ['grid-header.component.css']
})
export class GridHeaderComponent {
  @Input() header: ColumnConfig;
  @Output() sortGrid = new EventEmitter();
  @Output() filterGrid: EventEmitter<ColumnConfig> = new EventEmitter<ColumnConfig>();

  get headerClass() {
    return 'text-white col ' + this.getArrow();
  }

  onSortGrid() {
    if (this.header.sortable) {
      this.sortGrid.emit(R.assoc('sortType', R.isNil(this.header.sortType) ? SortType.Descending : this.header.sortType === SortType.Ascending ? null : SortType.Ascending, this.header));
    }
  }

  getArrow() {
    return getArrowClass(this.header.sortType);
  }

  changeFilterInConfig(singleConfig: ColumnConfig) {
    this.filterGrid.emit(singleConfig);
  }
}
