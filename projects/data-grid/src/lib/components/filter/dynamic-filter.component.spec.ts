import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterFn, GridFilter } from './grid-filter';
import { DynamicFilterComponent } from './dynamic-filter.component';
import { ComponentFactoryResolver, EventEmitter, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { FilteringOptions } from '../../models';
import { GridTranslateService } from '../../services/grid-translate.service';
import { GridDefaultTranslateService } from '../../services/grid-default-translate.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

class FilterComponentMock implements GridFilter<any> {
  value: any;
  filter: FilterFn<any>;
  option: FilteringOptions;
  readonly options: FilteringOptions[];
  valueChanged: EventEmitter<any>;

  clear(): void {
  }
}

fdescribe('DynamicFilterComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: DynamicFilterComponent;

  const componentFactoryResolverMock = {
    resolveComponentFactory: jasmine.createSpy('resolveComponentFactory')
  };

  const filterComponentMock = {
    valueChanged: new EventEmitter(),
    options: [FilteringOptions.None, FilteringOptions.Equals],
    clear: jasmine.createSpy('clear')
  };

  const componentRefMock = {
    instance: filterComponentMock,
    changeDetectorRef: {markForCheck: jasmine.createSpy('markForCheck')},
    destroy: jasmine.createSpy('destroy')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DynamicFilterComponent,
        TranslatePipe
      ],
      providers: [
        {
          provide: ComponentFactoryResolver,
          useValue: componentFactoryResolverMock
        },
        {
          provide: GridTranslateService,
          useClass: GridDefaultTranslateService
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(DynamicFilterComponent);
    component = fixture.componentInstance;

    component.filterHost = <any>{
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent').and.returnValue(componentRefMock)
    };

    spyOn(component.apply, 'emit');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize filter component', () => {
    // given
    component.filter = {
      component: FilterComponentMock,
      value: 'test',
      option: FilteringOptions.Equals
    };

    // when
    fixture.detectChanges();

    // then
    expect(component.filterHost.clear).toHaveBeenCalled();
    expect(componentFactoryResolverMock.resolveComponentFactory).toHaveBeenCalled();
    expect(component.filterHost.createComponent).toHaveBeenCalled();
    expect(component.form).toBeDefined();
    expect(component.filterOptions).toEqual(filterComponentMock.options);

    expect(component.form).toBeDefined();
    expect(component.filterValue.value).toEqual('test');
    expect(component.filterOption.value).toEqual(FilteringOptions.Equals);

    expect(component.filterInstance.value).toEqual('test');
    expect(component.filterInstance.option).toEqual(FilteringOptions.Equals);
  });

  it('should clear the applied filter', () => {
    // given
    component.filter = {
      component: FilterComponentMock,
      value: 'test',
      option: FilteringOptions.Equals
    };

    // when
    fixture.detectChanges();
    component.onClearFilter();

    // then
    expect(componentRefMock.changeDetectorRef.markForCheck).toHaveBeenCalled();
    expect(filterComponentMock.clear).toHaveBeenCalled();
    expect(component.apply.emit).toHaveBeenCalledWith(component.form.value);

    expect(component.filterValue.value).toEqual(null);
    expect(component.filterOption.value).toEqual(FilteringOptions.None);

    expect(component.filterInstance.value).toEqual(null);
    expect(component.filterInstance.option).toEqual(FilteringOptions.None);
  });

  it('should update the filter', () => {
    // given
    const oldFilter = {
      component: FilterComponentMock,
      value: 'test',
      option: FilteringOptions.Equals
    };
    const newFilter = {
      ...oldFilter,
      option: FilteringOptions.Contains,
      value: 'testUpdated'
    };
    component.filter = oldFilter;

    // when
    fixture.detectChanges();
    component.filter = newFilter;
    component.ngOnChanges({
      filter: new SimpleChange(oldFilter, newFilter, false)
    });

    // then
    expect(componentRefMock.changeDetectorRef.markForCheck).toHaveBeenCalled();

    expect(component.filterValue.value).toEqual('testUpdated');
    expect(component.filterOption.value).toEqual(FilteringOptions.Contains);

    expect(component.filterInstance.value).toEqual('testUpdated');
    expect(component.filterInstance.option).toEqual(FilteringOptions.Contains);
  });

});
