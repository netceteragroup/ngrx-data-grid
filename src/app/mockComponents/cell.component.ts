import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: 'cell.component.html'
})
export class CellComponent {
  @Input() data: any;
}
