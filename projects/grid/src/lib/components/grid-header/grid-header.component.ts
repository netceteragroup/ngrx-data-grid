import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig, SortType } from '../../config';

@Component({
  selector: 'pcs-grid-header',
  templateUrl: 'grid-header.component.html',
  styleUrls: ['grid-header.component.scss']
})
export class GridHeaderComponent {
  @Input() header: ColumnConfig;
  @Output() sortGrid = new EventEmitter();
  @Output() filterGrid: EventEmitter<ColumnConfig> = new EventEmitter<ColumnConfig>();

  filterExpanded = false;

  get filterExpandedStyle() {
    return {display: this.filterExpanded ? 'block' : 'none'};
  }

  get downCaretStyle() {
    return {'border-top': this.header.sortType === 'DESC' ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get upCaretStyle() {
    return {'border-bottom': this.header.sortType === 'ASC' ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get isFiltered() {
    return {'background-color': this.header.filter.isFiltered ? `#37c662` : null};
  }

  toggleExpanded() {
    this.filterExpanded = !this.filterExpanded;
  }

  onSortGrid() {
    if (this.header.sortable) {
      this.sortGrid.emit(R.assoc('sortType', R.isNil(this.header.sortType) ? SortType.Descending : this.header.sortType === SortType.Ascending ? null : SortType.Ascending, this.header));
    }
  }

  changeFilterInConfig(singleConfig: ColumnConfig) {
    this.filterGrid.emit(singleConfig);
  }
}
