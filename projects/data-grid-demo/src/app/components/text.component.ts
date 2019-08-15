import { Component, Input } from '@angular/core';
import { GridCell } from '../../../../data-grid/src/lib/models';

@Component({
  templateUrl: 'text.component.html',
  styleUrls: ['text.component.scss']
})
export class TextComponent implements GridCell<string> {
  @Input() data: string;
}
