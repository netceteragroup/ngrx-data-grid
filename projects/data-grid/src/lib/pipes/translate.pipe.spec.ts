import { TranslatePipe } from './translate.pipe';
import { TestBed } from '@angular/core/testing';
import { GridTranslateService } from '../services/grid-translate.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translateService: GridTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        {
          provide: GridTranslateService,
          useValue: {
            translate: jasmine.createSpy('translate').and.returnValue('translated')
          }
        }
      ]
    });

    translateService = TestBed.inject(GridTranslateService);
    pipe = TestBed.inject(TranslatePipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should add colon to the input', () => {
    // given
    const translationKey = 'test.key';
    const expected = 'translated';

    // when
    const result = pipe.transform(translationKey);

    // then
    expect(translateService.translate).toHaveBeenCalledWith(translationKey);
    expect(result).toEqual(expected);
  });

});
