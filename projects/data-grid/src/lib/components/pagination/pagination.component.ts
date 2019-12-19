import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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

  get numberOfItemsPerPage() {
    return this.paginationConfig.paginationPageSize;
  }

  get numberOfPages() {
    return this.paginationConfig.numberOfPages;
  }

  get shouldLoadThreeDotsButton() {
    return (this.currentPage + 2 < this.numberOfPages - 1);
  }

  get isLastButtonActive() {
    return this.currentPage === this.numberOfPages - 1;
  }

  get isFirstButtonActive() {
    return this.currentPage === 0;
  }

  get numberOfPagesArray() {
    return R.range(1, this.numberOfPages + 1);
  }

  get isDataBiggerThanPageSize() {
    return this.numberOfItemsPerPage < this.numberOfPages * this.numberOfItemsPerPage;
  }

  get lastPageIndex() {
    return R.dec(this.numberOfPages);
  }

  get previousPage() {
    return R.dec(this.currentPage);
  }

  get nextPage() {
    return R.inc(this.currentPage);
  }

  ngOnChanges() {
    this.startIndex = this.totalNumberOfItems > 0 ? this.currentPage * this.numberOfItemsPerPage + 1 : 0;
    this.endIndex = R.min(this.startIndex + this.numberOfItemsPerPage - 1, this.totalNumberOfItems);
  }

  trackByIndex(_, index) {
    return index;
  }

  loadThreeButtonsMax(page: number) {
    return (page - 1 === this.currentPage)
      || ((page - 1 === this.currentPage + 1) && (this.numberOfPages - 1 !== this.currentPage + 1))
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
