import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pcs-display-grid-example',
  templateUrl: './display-grid-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayGridExampleComponent {
  @Input() rowsNum: number;
  @Input() columnsNum: number;

  @Output() newRowAdded = new EventEmitter();
  @Output() newColumnAdded = new EventEmitter();

  get rows() {
    return Array(this.rowsNum).fill(1);
  }

  get columns() {
    return Array(this.columnsNum).fill(1);
  }

  onAddNewRow() {
    this.newRowAdded.emit();
  }

  onAddNewColumn() {
    this.newColumnAdded.emit();
  }

}
