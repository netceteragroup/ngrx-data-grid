import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ColumnSelectorComponent } from './column-selector.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GridTranslateService } from '../../services/grid-translate.service';

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;

  const columns = [
    {columnId: 'id-0', field: 'id', headerName: 'id', visible: true, sortAvailable: true, filterAvailable: true},
    {columnId: 'name-1', field: 'name', headerName: 'name', visible: true, sortAvailable: true, filterAvailable: true},
    {columnId: 'value-2', field: 'value', headerName: 'value', visible: true, sortAvailable: true, filterAvailable: true}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColumnSelectorComponent,
        TranslatePipe
      ],
      providers: [
        GridTranslateService
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    component = TestBed.createComponent(ColumnSelectorComponent).componentInstance;
    component.columns = columns;
    spyOn(component.toggleColumnVisibility, 'emit');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when column is toggled', () => {
    // when
    component.onToggleColumn(columns[0]);

    // then
    expect(component.toggleColumnVisibility.emit).toHaveBeenCalledWith('id-0');
  });

  it('should return header name', () => {
    // given
    const expected = 'name';

    // when
    const result = component.getHeaderName(columns[1]);

    // then
    expect(result).toEqual(expected);
  });

  it('should return column id', () => {
    // given
    const expected = 'id-0';

    // when
    const result = component.getColumnId(columns[0]);

    // then
    expect(result).toEqual(expected);
  });

  it('should return true if the column is visible', () => {
    // given
    const expected = true;

    // when
    const result = component.getColumnVisible(columns[0]);

    // then
    expect(result).toEqual(expected);
  });

  it('should set the expanded property to true', () => {
    // when
    component.toggleColumns();

    // then
    expect(component.expanded).toEqual(true);
  });

  it('should set the expanded property to false', () => {
    // given
    component.expanded = true;

    // when
    component.toggleColumns();

    // then
    expect(component.expanded).toEqual(false);
  });

});
