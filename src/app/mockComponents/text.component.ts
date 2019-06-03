import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: 'text.component.html'
})
export class TextComponent {
  @Input() data: string;
}
