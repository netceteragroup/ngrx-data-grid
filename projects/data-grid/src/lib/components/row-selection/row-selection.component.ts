
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LOCALE_TEXT_KEYS } from '../../constants';
import { ButtonStyle } from '../button/button-style';

@Component({
  selector: 'ngrx-row-selection',
  templateUrl: './row-selection.component.html',
  styleUrls: ['./row-selection.component.scss']
})
export class RowSelectionComponent {
  @Input() allPagesSelected = false;
  @Input() currentPageSelected = false;

  @Output() allSelected = new EventEmitter();
  @Output() pageSelected = new EventEmitter();

  readonly localeTexts = LOCALE_TEXT_KEYS.grid.selection;

  get allPagesButtonStyle() {
    return this.allPagesSelected
    ? ButtonStyle.Primary
    : ButtonStyle.Default;
  }

  get currentPageButtonStyle() {
    return this.currentPageSelected
    ? ButtonStyle.Primary
    : ButtonStyle.Default;
  }

}
