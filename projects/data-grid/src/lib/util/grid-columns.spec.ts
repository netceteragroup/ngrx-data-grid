import { getColumnsForSelection, getHiddenColumns, getNumberOfHiddenColumnsBeforeIndex, getNumberOfVisibleColumns, updateColumnWidth } from './grid-columns';
import { DataGridColumnWithId } from '../models';

describe('GridColumns', () => {

  describe('getNumberOfVisibleColumns - returns the number of visible grid columns', () => {
    it('should return 0 if the list of columns is empty', () => {
      // given
      const columns = [];
      const expected = 0;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });

    it('should return 0 if the list of columns is undefined or null', () => {
      // given
      const columns = null;
      const expected = 0;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });

    it('should return 0', () => {
      // given
      const columns = [{visible: false}, {visible: false}] as DataGridColumnWithId[];
      const expected = 0;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });

    it('should return 1', () => {
      // given
      const columns = [{visible: true}, {visible: false}] as DataGridColumnWithId[];
      const expected = 1;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });
  });

  it('should find hidden columns', () => {
    // given
    const columns = [
      {visible: true},
      {visible: false},
      {visible: false},
      {visible: true},
      {visible: true}
    ] as DataGridColumnWithId[];

    // when
    const result = getHiddenColumns(columns);

    // then
    expect(result.length).toBe(2);
  });

  it('should find number of hidden columns before given index', () => {
    // given
    const columns = [
      {visible: true},
      {visible: false},
      {visible: false},
      {visible: true},
      {visible: true}
    ] as DataGridColumnWithId[];

    // when
    const result = getNumberOfHiddenColumnsBeforeIndex(3, columns);

    // then
    expect(result).toBe(2);
  });

  it('should update column width by given column id', () => {
    // given
    const columns = [
      {columnId: 'col1', width: 100, visible: true},
      {columnId: 'col2', width: 101, visible: true},
      {columnId: 'col3', width: 102, visible: true}
    ] as DataGridColumnWithId[];

    // when
    const updatedColumns = updateColumnWidth('col2', 500, columns);

    // then
    expect(updatedColumns[0].width).toBe(100);
    expect(updatedColumns[1].width).toBe(500);
    expect(updatedColumns[2].width).toBe(102);
  });

  it('should filter the columns without header name and which are hidden for selection', () => {
    // given
    const columns = [
      {headerName: 'col1', visible: true},
      {headerName: 'col2', visible: true, hideInSelection: true},
      {headerName: 'col3', visible: false},
      {headerName: 'col4', visible: true, hideInSelection: false},
      {headerName: null, visible: true},
      {visible: true},
      {headerName: '', visible: true}
    ] as DataGridColumnWithId[];

    // when
    const columnsForSelection = getColumnsForSelection(columns);

    // then
    expect(columnsForSelection.length).toBe(3);
    expect(columnsForSelection[0].headerName).toBe('col1');
    expect(columnsForSelection[1].headerName).toBe('col3');
  });
});
