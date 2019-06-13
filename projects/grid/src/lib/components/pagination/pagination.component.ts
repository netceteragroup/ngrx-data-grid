import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as R from 'ramda';
import { DataAndConfig } from '@grid/config/column-config';
import { PaginationConfig } from '@grid/config/grid-config';

@Component({
  selector: 'pcs-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() data: Array<Array<DataAndConfig>>;
  @Input() paginationConfig: PaginationConfig;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[];

  constructor() {
  }

  get shouldThreeDotsButtonLoad() {
    return ((this.paginationConfig.currentPage + 2 !== this.pages.length - 1) && (this.paginationConfig.currentPage === 0) && (this.pages.length !== 2))
      || (((this.paginationConfig.currentPage !== 0) && (this.paginationConfig.currentPage !== this.pages.length - 1))
        && ((this.paginationConfig.currentPage !== 0) && (this.paginationConfig.currentPage + 1 !== this.pages.length - 1))
        && (this.pages.length !== 2));
  }

  get isLastButtonActive() {
    return this.paginationConfig.currentPage === this.pages.length - 1;
  }

  get isFirstButtonActive() {
    return this.paginationConfig.currentPage === 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    R.cond([
      [R.has('paginationConfig'), () => this.pages = R.range(1, Math.ceil(this.data.length / this.paginationConfig.paginationPageSize) + 1)]
    ])(changes);
  }

  loadThreeButtonsMax(page: number) {
    return (page - 1 === this.paginationConfig.currentPage)
      || ((page - 1 === this.paginationConfig.currentPage + 1) && (this.pages.length - 1 !== this.paginationConfig.currentPage + 1))
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
