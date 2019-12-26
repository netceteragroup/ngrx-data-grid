import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LOCALE_TEXT_KEYS } from '../../constants';

@Component({
  selector: 'ngrx-empty-content',
  template: `<p>{{emptyContentMsg | ngrxTranslate}}</p>`,
  styleUrls: ['./empty-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyContentComponent {
  readonly emptyContentMsg = LOCALE_TEXT_KEYS.grid.noData;
}
