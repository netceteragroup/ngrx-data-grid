import { getNumberOfVisibleColumns } from './grid-columns';
import { DataGridColumn } from '../models';

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

    it('should return 0', () => {
      // given
      const columns = [{visible: false}, {visible: false}] as DataGridColumn[];
      const expected = 0;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });

    it('should return 1', () => {
      // given
      const columns = [{visible: true}, {visible: false}] as DataGridColumn[];
      const expected = 1;

      // when
      const result = getNumberOfVisibleColumns(columns);

      // then
      expect(result).toBe(expected);
    });
  });


});
