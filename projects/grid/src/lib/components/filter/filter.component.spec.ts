import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from '@grid/components/filter/filter.component';
import { FilterOptionsService } from '@grid/services/filter-options/filter-options.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PriceComponent } from '../../../../../../src/app/components/price.component';
import { filteringOptions, FilterType } from '@grid/config/filter-config';
import { FormControl, FormGroup } from '@angular/forms';
import { ColumnConfig } from '@grid/config/column-config';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let filter: FilterOptionsService;

  const mockConfig: ColumnConfig = {
    headerName: 'id',
    field: 'userId',
    component: PriceComponent,
    isVisible: false,
    sortable: true,
    filter: {
      type: FilterType.textFilterType
    }
  };

  const mockForm = new FormGroup({
    firstFilterProperty: new FormControl('None'),
    firstFilterValue: new FormControl('')
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      providers: [FilterOptionsService],
      imports: [NgbModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    fixture = TestBed.createComponent(FilterComponent);
    filter = TestBed.get(FilterOptionsService);
    component = fixture.componentInstance;
    component.config = mockConfig;
    spyOn(component.changeFilterInConfig, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when type is not DateFilterType', () => {
    expect(component.isDateField).toEqual(false);
  });

  it('should get type for the input property', () => {
    // given
    fixture.detectChanges();
    const input = fixture.debugElement.nativeElement.querySelector('input').type;

    // then
    expect(component.inputType).toEqual(input);
  });

  it('should create form group', () => {
    // when
    component.ngOnInit();

    // then
    expect(component.filterOptions).toBe(filter.textFilterOptions);
    expect(component.form.value).toEqual(mockForm.value);
  });

  it('should emit change when filter config has changed', () => {
    // given
    mockConfig.filter = {
      ...mockConfig.filter,
      condition: {
        filterKey: filteringOptions.None,
        filterValue: ''
      }
    };
    component.firstFilterValue = new FormControl('aAbB');
    component.firstFilterProperty = new FormControl(filteringOptions.Contains);

    // when
    component.onSubmitFilterForm();

    // then
    expect(component.changeFilterInConfig.emit).toHaveBeenCalledWith(mockConfig);
  });

  it('should create filter field in config', () => {
    // given
    component.firstFilterValue = new FormControl('aAbB');
    component.firstFilterProperty = new FormControl(filteringOptions.Contains);

    // when
    component.onSubmitFilterForm();

    // then
    expect(component.changeFilterInConfig.emit).toHaveBeenCalledWith(mockConfig);
  });
});
