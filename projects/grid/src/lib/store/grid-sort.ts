import { ColumnConfig, SortType } from '@grid/config/column-config';
import * as R from 'ramda';
import { getFilteredData } from '@grid/store/grid-filter';
import { GridState } from '@grid/store/grid-reducer';

export const applySort = (state: GridState): GridState => {
  const sortActiveColumn: ColumnConfig = R.head(R.filter((config: ColumnConfig) => !R.isNil(config.sortType), state.columnConfig));
  const initialData = getFilteredData(state);
  const sortedData = R.cond([
    [R.isNil, R.always(initialData)],
    [R.T, () => R.cond([
      [R.equals(SortType.Ascending), () => R.reverse(R.sort(R.descend(<any>R.prop(sortActiveColumn.field)))(state.gridData))],
      [R.equals(SortType.Descending), () => <any>R.cond([
        [R.isNil, () => R.sort(R.descend(<any>R.prop(sortActiveColumn.field)))(state.gridData)],
        [R.T, () => R.sort(<any>sortActiveColumn.comparator)(state.gridData)]
      ])(sortActiveColumn.comparator)]
    ])(sortActiveColumn.sortType)],
  ])(sortActiveColumn);

  return R.mergeDeepRight(state, {gridData: sortedData});
};
