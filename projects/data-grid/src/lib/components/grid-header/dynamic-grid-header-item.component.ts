import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
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
  HEADER_NAME_ID,
  headerName,
  sortAscending,
  sortDescending,
  SortType
} from '../../models';
import { hasNoValue } from '../../util/type';
import { GridConfig } from '../../config';
import {
  CdkConnectedOverlay, FlexibleConnectedPositionStrategy
} from '@angular/cdk/overlay';

@Component({
  selector: 'ngrx-dynamic-grid-header-item',
  templateUrl: 'dynamic-grid-header-item.component.html',
  styleUrls: ['dynamic-grid-header-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicGridHeaderItemComponent {
  @Input() column: DataGridColumnWithId;
  @Input() config: GridConfig;
  @Input() filterSequence: number;

  @Output() sortGrid = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid = new EventEmitter<ApplyFilterEvent>();

  @ViewChild(CdkConnectedOverlay) dynamicFilterOverlay: CdkConnectedOverlay;

  filterExpanded = false;
  HEADER_NAME_ID = HEADER_NAME_ID;

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

  get ellipsisClass() {
    return this.config.columnResize ? 'ellipsis' : '';
  }

  isFilterVisible() {
    return this.filterExpanded && this.filterAvailable;
  }

  toggleExpanded() {
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

  onPositionChange(event: FlexibleConnectedPositionStrategy) {
    this.dynamicFilterOverlay.overlayRef.updatePositionStrategy(event);
    this.dynamicFilterOverlay.overlayRef.updatePosition();
  }
}
