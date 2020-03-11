import { getNumberOfVisibleColumns } from './grid-columns';
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


});
