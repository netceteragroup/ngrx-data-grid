import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as R from 'ramda';
import { PaginationConfig } from '@grid/config/grid-config';

@Component({
  selector: 'pcs-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.css']
})
export class PaginationComponent {
  @Input() paginationConfig: PaginationConfig;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[];

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

  loadThreeButtonsMax(page: number) {
    return (page - 1 === this.paginationConfig.currentPage)
      || ((page - 1 === this.paginationConfig.currentPage + 1) && (this.paginationConfig.numberOfPages - 1 !== this.paginationConfig.currentPage + 1))
      || (page - 1 === this.paginationConfig.currentPage - 1);
  }

  sendActiveStatus(page: number) {
    return page - 1 === this.paginationConfig.currentPage;
  }

  onClickPageNum(pageNum: number) {
    this.pageNumChange.emit(pageNum);
  }

  onSelectPageSize(e: any) {
    this.pageSizeChange.emit(e.target.value);
  }
}
