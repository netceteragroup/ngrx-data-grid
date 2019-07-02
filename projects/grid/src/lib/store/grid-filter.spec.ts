import { getFilteredData } from '@grid/store/grid-filter';
import { FilteringOptions, FilterType } from '@grid/config/filter-config';

describe('GridFilter', () => {
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
  const grid = {
    columnConfig: [],
    initialData: gridDataExample
  };
  it('should return data where foo equals 1', () => {
    // given
    grid.columnConfig = [{
      field: 'foo',
      filter: {
        type: FilterType.NumberFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Equals,
          filterValue: 1
        }
      }
    }];

    // then
    expect(getFilteredData(<any>grid)).toEqual([{
      gridRowId: 0,
      foo: 1,
      bar: 'one',
      date: 1020368095429
    }, {
      gridRowId: 3,
      foo: 1,
      bar: 'one',
      date: 1152654179031
    }]);
  });

  it('should return data where bar contains letter e', () => {
    // given
    grid.columnConfig = [{
      field: 'bar',
      filter: {
        type: FilterType.TextFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Contains,
          filterValue: 'e'
        }
      }
    }];

    // then
    expect(getFilteredData(<any>grid)).toEqual([{
      gridRowId: 0,
      foo: 1,
      bar: 'one',
      date: 1020368095429
    }, {
      gridRowId: 1,
      foo: 3,
      bar: 'three',
      date: 952155516036
    }, {
      gridRowId: 3,
      foo: 1,
      bar: 'one',
      date: 1152654179031
    }, {
      gridRowId: 4,
      foo: 3,
      bar: 'three',
      date: 1103419914425
    }]);
  });

  it('should get date that equals 2006-07-11', () => {
    // given
    grid.columnConfig = [{
      valueFormatter: (date) => {
        let fromDates = '';
        fromDates = fromDates
          + new Date(date).getFullYear() + '-'
          + ('0' + (new Date(date).getMonth() + 1)).slice(-2) + '-'
          + ('0' + (new Date(date).getDay() + 1)).slice(-2) + ' ';
        return fromDates.trim();
      },
      field: 'date',
      filter: {
        type: FilterType.DateFilterType,
        isFiltered: true,
        condition: {
          filterKey: FilteringOptions.Equals,
          filterValue: {
            year: 2004,
            month: 12,
            day: 1
          }
        }
      }
    }];

    // then
    expect(getFilteredData(<any>grid)).toEqual([{
      gridRowId: 4,
      foo: 3,
      bar: 'three',
      date: 1103419914425
    }]);
  });
});
