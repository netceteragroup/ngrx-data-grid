import { Component, Input } from '@angular/core';
import { GridCell } from 'ngrx-data-grid';

@Component({
  selector: 'app-demo-text',
  templateUrl: 'text.component.html',
  styleUrls: ['text.component.scss']
})
export class TextComponent implements GridCell<string> {
  @Input() data: string;
}
