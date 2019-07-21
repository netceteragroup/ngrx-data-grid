import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnConfig } from '../../config';

@Component({
  selector: 'ngrx-column-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnSelectorComponent {
  @Input() headers: Array<string>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Output() toggleColumnVisibility: EventEmitter<string> = new EventEmitter<string>();
  expanded = false;

  get checkboxStyle() {
    return {display: this.expanded ? 'block' : 'none'};
  }

  toggleColumn(index: number) {
    this.toggleColumnVisibility.emit(`${this.columnConfig[index].field}-${index}`);
  }

  toggleColumns() {
    this.expanded = !this.expanded;
  }
}
