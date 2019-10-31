import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaginationComponent } from './pagination.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GridTranslateService } from '../../services/grid-translate.service';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaginationComponent,
        TranslatePipe
      ],
      providers: [
        GridTranslateService
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    spyOn(component.pageSizeChange, 'emit');
    spyOn(component.pageNumberChange, 'emit');
  });


  it('should render component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change in page size', () => {
    // given
    const pageSize = 20;

    // when
    component.onSelectPageSize(pageSize);

    // then
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(pageSize);
  });

  it('should emit change in page number', () => {
    // given
    const pageNum = 3;

    // when
    component.onPageNumberChange(pageNum);

    // then
    expect(component.pageNumberChange.emit).toHaveBeenCalledWith(pageNum);
  });

  it('should not load ThreeDots button', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 0,
      numberOfPages: 2
    };

    // then
    expect(component.shouldLoadThreeDotsButton).toEqual(false);
  });

  it('should load ThreeDots button', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 4,
      numberOfPages: 23
    };

    // then
    expect(component.shouldLoadThreeDotsButton).toEqual(true);
  });

  it('should mark first button as active', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 0,
      numberOfPages: 23
    };

    // then
    expect(component.isFirstButtonActive).toEqual(true);
  });

  it('should mark last button as active', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 23,
      numberOfPages: 24
    };

    // then
    expect(component.isLastButtonActive).toEqual(true);
  });

  it('should return numberOfPages as array of the range', () => {
    // given
    component.paginationConfig = <any>{
      numberOfPages: 3
    };

    // then
    expect(component.numberOfPagesArray).toEqual([1, 2, 3]);
  });

  it('should return previous page index', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 4
    };

    // then
    expect(component.previousPage).toEqual(3);
  });

  it('should return next page index', () => {
    // given
    component.paginationConfig = <any>{
      currentPage: 4
    };

    // then
    expect(component.nextPage).toEqual(5);
  });

  it('should return last page index', () => {
    // given
    component.paginationConfig = <any>{
      numberOfPages: 23
    };

    // then
    expect(component.lastPageIndex).toEqual(22);
  });

});
