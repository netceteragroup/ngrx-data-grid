import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnConfig } from '../../config';

@Component({
  selector: 'pcs-column-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnSelectorComponent {
  @Input() headers: Array<string>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Output() toggleColumnVisibility: EventEmitter<number> = new EventEmitter<number>();
  expanded = false;

  get checkboxStyle() {
    return {display: this.expanded ? 'block' : 'none'};
  }

  toggleColumn(index: number) {
    this.toggleColumnVisibility.emit(index);
  }

  toggleColumns() {
    this.expanded = !this.expanded;
  }
}
