import { TextFilterComponent } from '../components/filter/text-filter.component';
import { NumberFilterComponent } from '../components/filter/number-filter.component';
import { BooleanFilterComponent } from '../components/filter/boolean-filter.component';
import {
  columnFilter,
  ColumnValueGetter,
  columnValueResolver,
  DataGridColumnWithId,
  filterApplied,
  FilteringOptions,
  FilterType,
  findDataGridColumnsWithFilters,
  GridDataFilter,
  getRawValueResolver,
  DataItemValueGetter
} from '../models';
import * as R from 'ramda';
import { FilterFn } from '../components/filter/grid-filter';

export const textFilterType = R.equals(FilterType.Text);
export const numberFilterType = R.equals(FilterType.Number);
export const booleanFilterType = R.equals(FilterType.Boolean);

export const getFilterComponent = R.cond([
  [textFilterType, R.always(TextFilterComponent)],
  [numberFilterType, R.always(NumberFilterComponent)],
  [booleanFilterType, R.always(BooleanFilterComponent)],
]);

export interface AppliedFilter {
  filter: FilterFn<any>;
  valueResolver: DataItemValueGetter | ColumnValueGetter;
  rawValueResolver: ColumnValueGetter;
  value: ColumnValueGetter;
  option: FilteringOptions;
}

const toAppliedFilter = (c: DataGridColumnWithId): AppliedFilter => {
  const gridFilter: GridDataFilter = columnFilter(c);
  const component = gridFilter.component || getFilterComponent(gridFilter.filterType);
  const filter = Reflect.get(component.prototype, 'filter') as FilterFn<any>;

  return {
    option: gridFilter.option,
    value: gridFilter.value,
    valueResolver: gridFilter.dataItemValueGetter || columnValueResolver(c),
    rawValueResolver: getRawValueResolver(c),
    filter
  };
};

type GetAppliedFilters = (columns: DataGridColumnWithId[]) => AppliedFilter[];
export const getAppliedFilters: GetAppliedFilters = R.compose(
  R.map(toAppliedFilter),
  R.filter(R.propSatisfies(filterApplied, 'filter')),
  findDataGridColumnsWithFilters
);

const allFiltersPass = (filters: AppliedFilter[]) => (dataItem: any): boolean =>
  R.all(({filter, valueResolver, rawValueResolver, ...rest}: AppliedFilter) => filter({
      dataItemValue: valueResolver(dataItem),
      rawValue: rawValueResolver(dataItem),
      ...rest,
    }),
    filters
  );

export const applyFilters = (filters: AppliedFilter[]) => (data: any[]) =>
  R.isEmpty(filters)
    ? data
    : R.filter(allFiltersPass(filters), data);
