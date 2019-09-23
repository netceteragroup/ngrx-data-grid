import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import * as R from 'ramda';
import {PaginationConfig} from '../../config';
import { LOCALE_TEXT_KEYS } from '../../constants';

@Component({
  selector: 'ngrx-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() paginationConfig: PaginationConfig;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

  readonly localeTexts = LOCALE_TEXT_KEYS.grid.pagination;

  get shouldLoadThreeDotsButton() {
    return (this.paginationConfig.currentPage + 2 < this.paginationConfig.numberOfPages - 1);
  }

  get isLastButtonActive() {
    return this.paginationConfig.currentPage === this.paginationConfig.numberOfPages - 1;
  }

  get isFirstButtonActive() {
    return this.paginationConfig.currentPage === 0;
  }

  get numberOfPagesArray() {
    return R.range(1, this.paginationConfig.numberOfPages + 1);
  }

  get isDataBiggerThanPageSize() {
    return this.paginationConfig.paginationPageSize < this.paginationConfig.numberOfPages * this.paginationConfig.paginationPageSize;
  }

  get lastPageIndex() {
    return R.dec(this.paginationConfig.numberOfPages);
  }

  get previousPage() {
    return R.dec(this.paginationConfig.currentPage);
  }

  get nextPage() {
    return R.inc(this.paginationConfig.currentPage);
  }

  trackByIndex(_, index) {
    return index;
  }

  loadThreeButtonsMax(page: number) {
    return (page - 1 === this.paginationConfig.currentPage)
      || ((page - 1 === this.paginationConfig.currentPage + 1) && (this.paginationConfig.numberOfPages - 1 !== this.paginationConfig.currentPage + 1))
      || (page - 1 === this.paginationConfig.currentPage - 1);
  }

  sendActiveStatus(page: number) {
    return page - 1 === this.paginationConfig.currentPage;
  }

  onPageNumberChange(pageNum: number) {
    this.pageNumberChange.emit(pageNum);
  }

  onSelectPageSize(value: number) {
    this.pageSizeChange.emit(value);
  }

}
