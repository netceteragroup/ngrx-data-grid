import { Component, Input } from '@angular/core';
import { GridConfig } from '../../config';

@Component({
  selector: 'ngrx-detail-grid',
  templateUrl: 'detail-grid.component.html'
})
export class DetailGridComponent {
  @Input() config: GridConfig;
  @Input() name: string;
}
