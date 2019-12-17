import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import * as R from 'ramda';
import { PaginationConfig } from '../../config';
import { LOCALE_TEXT_KEYS } from '../../constants';

@Component({
  selector: 'ngrx-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
  @Input() paginationConfig: PaginationConfig;
  @Input() totalNumberOfItems: number;
  @Input() numberOfVisibleItems: number;

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

  readonly localeTexts = LOCALE_TEXT_KEYS.grid.pagination;
  startIndex = 0;
  endIndex = 0;

  get currentPage() {
    return this.paginationConfig.currentPage;
  }

  get pageSize() {
    return this.paginationConfig.paginationPageSize;
  }

  get shouldLoadThreeDotsButton() {
    return (this.currentPage + 2 < this.paginationConfig.numberOfPages - 1);
  }

  get isLastButtonActive() {
    return this.currentPage === this.paginationConfig.numberOfPages - 1;
  }

  get isFirstButtonActive() {
    return this.currentPage === 0;
  }

  get numberOfPagesArray() {
    return R.range(1, this.paginationConfig.numberOfPages + 1);
  }

  get isDataBiggerThanPageSize() {
    return this.pageSize < this.paginationConfig.numberOfPages * this.pageSize;
  }

  get lastPageIndex() {
    return R.dec(this.paginationConfig.numberOfPages);
  }

  get previousPage() {
    return R.dec(this.currentPage);
  }

  get nextPage() {
    return R.inc(this.currentPage);
  }

  ngOnChanges() {
    this.startIndex = this.currentPage * this.pageSize + 1;
    this.endIndex = R.min(this.startIndex + this.pageSize, this.totalNumberOfItems);
  }

  trackByIndex(_, index) {
    return index;
  }

  loadThreeButtonsMax(page: number) {
    return (page - 1 === this.currentPage)
      || ((page - 1 === this.currentPage + 1) && (this.paginationConfig.numberOfPages - 1 !== this.currentPage + 1))
      || (page - 1 === this.currentPage - 1);
  }

  sendActiveStatus(page: number) {
    return page - 1 === this.currentPage;
  }

  onPageNumberChange(pageNum: number) {
    this.pageNumberChange.emit(pageNum);
  }

  onSelectPageSize(value: number) {
    this.pageSizeChange.emit(value);
  }

}
