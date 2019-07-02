import { SortType } from '@grid/config/column-config';
import { filteringOptions, FilterType } from '@grid/config/filter-config';
import { applySort } from '@grid/store/grid-sort';
import { getFilteredData } from '@grid/store/grid-filter';

describe('GridSort', () => {
  const gridDataExample: Object[] = [
    {
      gridRowId: 0,
      foo: 1,
      bar: 'one',
      date: 1020368095429
    },
    {
      gridRowId: 1,
      foo: 3,
      bar: 'three',
      date: 952155516036
    },
    {
      gridRowId: 2,
      foo: 2,
      bar: 'two',
      date: 952155516036
    },
    {
      gridRowId: 3,
      foo: 1,
      bar: 'one',
      date: 1152654179031
    },
    {
      gridRowId: 4,
      foo: 3,
      bar: 'three',
      date: 1103419914425
    },
    {
      gridRowId: 5,
      foo: 2,
      bar: 'two',
      date: 1328025542673
    }
  ];
  let grid = {
    columnConfig: [],
    gridData: [],
    initialData: gridDataExample
  };

  afterEach(() => {
    grid = {
      columnConfig: [],
      gridData: [],
      initialData: gridDataExample
    };
  });

  it('return grid in descending order', () => {
    // given
    grid.columnConfig = [{
      field: 'foo',
      sortType: null,
      filter: {
        isFiltered: true,
        type: FilterType.numberFilterType,
        condition: {
          filterKey: filteringOptions.Equals,
          filterValue: 3
        }
      }
    }, {
      field: 'date',
      sortType: SortType.Descending,
      filter: {
        isFiltered: false,
        type: FilterType.DateFilterType,
      }
    }];
    grid.gridData = getFilteredData(<any>grid);
    // then
    expect(applySort(<any>grid)).toEqual([{
      gridRowId: 4, foo: 3, bar: 'three', date: 1103419914425
    }, {
      gridRowId: 1, foo: 3, bar: 'three', date: 952155516036
    }]);
  });

  it('return grid in ascending order', () => {
    // given
    grid = {
      columnConfig: [{
        field: 'foo',
        sortType: SortType.Descending,
        filter: {
          isFiltered: false,
          type: FilterType.numberFilterType,
        }
      }],
      gridData: gridDataExample,
      initialData: gridDataExample
    };

    grid.gridData = applySort(<any>grid);

    grid.columnConfig = [{
      field: 'foo',
      sortType: SortType.Ascending,
      filter: {
        isFiltered: false,
        type: FilterType.numberFilterType,
      }
    }];

    // then
    expect(applySort(<any>grid)).toEqual([{
      gridRowId: 3, foo: 1, bar: 'one', date: 1152654179031
    }, {
      gridRowId: 0, foo: 1, bar: 'one', date: 1020368095429
    }, {
      gridRowId: 5, foo: 2, bar: 'two', date: 1328025542673
    }, {
      gridRowId: 2, foo: 2, bar: 'two', date: 952155516036
    }, {
      gridRowId: 4, foo: 3, bar: 'three', date: 1103419914425
    }, {
      gridRowId: 1, foo: 3, bar: 'three', date: 952155516036
    }]);
  });

});
