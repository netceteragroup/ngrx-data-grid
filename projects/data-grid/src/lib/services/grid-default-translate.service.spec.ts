import { GridDefaultTranslateService } from './grid-default-translate.service';
import { TestBed } from '@angular/core/testing';


describe('GridDefaultTranslateService', () => {
  let service: GridDefaultTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GridDefaultTranslateService
      ]
    });

    service = TestBed.inject(GridDefaultTranslateService);
  });

  it('should return corresponding text for given filter translation key', () => {
    // given
    const translationKey = 'grid.filter.apply';
    const expected = 'Apply';

    // when
    const result = service.translate(translationKey);

    // then
    expect(result).toEqual(expected);
  });

  it('should return corresponding text for given column selector translation key', () => {
    // given
    const translationKey = 'grid.columnSelector.title';
    const expected = 'Columns';

    // when
    const result = service.translate(translationKey);

    // then
    expect(result).toEqual(expected);
  });

  it('should return corresponding text for given pagination translation key', () => {
    // given
    const translationKey = 'grid.pagination.itemsPerPage';
    const expected = 'Items per page:';

    // when
    const result = service.translate(translationKey);

    // then
    expect(result).toEqual(expected);
  });

});
