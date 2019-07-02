import { SortType } from '@grid/config/column-config';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';
import { applySort } from '@grid/store/grid-sort';
import { getFilteredData } from '@grid/store/grid-filter';

describe('GridSort', () => {
  const gridDataExample: Object[] = [
    {
      foo: 1,
      bar: 'one',
      date: 1020368095429
    },
    {
      foo: 3,
      bar: 'three',
      date: 952155516036
    },
    {
      foo: 2,
      bar: 'two',
      date: 952155516036
    },
    {
      foo: 1,
      bar: 'one',
      date: 1152654179031
    },
    {
      foo: 3,
      bar: 'three',
      date: 1103419914425
    },
    {
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
        type: FilterType.NumberFilterType,
        condition: {
          filterKey: FilteringOptions.Equals,
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
    expect(applySort(<any>grid).gridData).toEqual([{
      foo: 3, bar: 'three', date: 1103419914425
    }, {
      foo: 3, bar: 'three', date: 952155516036
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
          type: FilterType.NumberFilterType,
        }
      }],
      gridData: gridDataExample,
      initialData: gridDataExample
    };

    grid.gridData = applySort(<any>grid).gridData;

    grid.columnConfig = [{
      field: 'foo',
      sortType: SortType.Ascending,
      filter: {
        isFiltered: false,
        type: FilterType.NumberFilterType,
      }
    }];

    // then
    expect(applySort(<any>grid).gridData).toEqual([{
      foo: 1, bar: 'one', date: 1152654179031
    }, {
      foo: 1, bar: 'one', date: 1020368095429
    }, {
      foo: 2, bar: 'two', date: 1328025542673
    }, {
      foo: 2, bar: 'two', date: 952155516036
    }, {
      foo: 3, bar: 'three', date: 1103419914425
    }, {
      foo: 3, bar: 'three', date: 952155516036
    }]);
  });

});
