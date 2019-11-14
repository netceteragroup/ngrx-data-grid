import { ButtonStyle } from './../button/button-style';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GridTranslateService } from '../../services/grid-translate.service';
import { RowSelectionComponent } from './row-selection.component';

describe('RowSelectionComponent', () => {
  let component: RowSelectionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RowSelectionComponent,
        TranslatePipe
      ],
      providers: [
        GridTranslateService
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    component = TestBed.createComponent(RowSelectionComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.allPagesButtonStyle).toEqual(ButtonStyle.Default);
    expect(component.allPagesButtonStyle).toEqual(ButtonStyle.Default);
  });

  it('should have primary button style for the all pages button', () => {
    // given
    component.allPagesSelected = true;

    // then
    expect(component.allPagesButtonStyle).toEqual(ButtonStyle.Primary);
  });

  it('should have primary button style for the current page button', () => {
    // given
    component.currentPageSelected = true;

    // then
    expect(component.currentPageButtonStyle).toEqual(ButtonStyle.Primary);
  });

});
