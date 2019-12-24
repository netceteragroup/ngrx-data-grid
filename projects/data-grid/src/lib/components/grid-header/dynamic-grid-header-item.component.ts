import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  ApplyFilterEvent,
  columnFilter,
  columnFilterAvailable,
  columnSortAvailable,
  columnSortType,
  DataGridColumnWithId,
  filterApplied,
  getColumnId,
  GridDataSortWithColumnId,
  headerName,
  sortAscending,
  sortDescending,
  SortType
} from '../../models';
import { hasNoValue } from '../../util/type';
import { DynamicElementPosition } from 'projects/data-grid/src/lib/directives/dynamic-grid-element.directive';

@Component({
  selector: 'ngrx-dynamic-grid-header-item',
  templateUrl: 'dynamic-grid-header-item.component.html',
  styleUrls: ['dynamic-grid-header-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicGridHeaderItemComponent {
  @Input() column: DataGridColumnWithId;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();

  @ViewChild('toggleButton', {static: false, read: ElementRef}) toggleButton: ElementRef;

  filterExpanded = false;

  position: DynamicElementPosition;

  get headerName() {
    return headerName(this.column);
  }

  get sortAvailable() {
    return columnSortAvailable(this.column);
  }

  get filterAvailable() {
    return columnFilterAvailable(this.column);
  }

  get columnId() {
    return getColumnId(this.column);
  }

  get filter() {
    return columnFilter(this.column);
  }

  get sortType() {
    return columnSortType(this.column);
  }

  get downCaretStyle() {
    return {'border-top': sortDescending(this.sortType) ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get upCaretStyle() {
    return {'border-bottom': sortAscending(this.sortType) ? '5px solid rgba(16, 46, 84, 0.8)' : null};
  }

  get isFiltered() {
    return {'background-color': filterApplied(this.filter) ? '#37c662' : null};
  }

  isFilterVisible() {
    return this.filterExpanded && this.filterAvailable;
  }

  toggleExpanded() {
    const {x, y} = this.toggleButton.nativeElement.getBoundingClientRect();
    this.position = {
      left: x,
      top: y
    };
    this.filterExpanded = !this.filterExpanded;
  }

  onApplySort() {
    if (this.sortAvailable) {
      const updatedSortType = hasNoValue(this.sortType) ? SortType.Descending : sortAscending(this.sortType) ? null : SortType.Ascending;
      this.sortGrid.emit({sortType: updatedSortType, columnId: this.columnId});
    }
  }

  onApplyFilter(event: ApplyFilterEvent) {
    if (this.filterAvailable) {
      this.filterGrid.emit({columnId: this.columnId, ...event});
    }
  }

}
