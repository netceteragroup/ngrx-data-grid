import { DataGridColumnWithId } from '../models';
import { toColumnsStyle } from './columns-style';

describe('ColumnsStyle', () => {

  it('should return the default style if no width is specified', () => {
    // given
    const columns = [{visible: true}] as DataGridColumnWithId[];
    const expected = 'minmax(150px, 1.4fr)';

    // when
    const result = toColumnsStyle(columns);

    // then
    expect(result).toBe(expected);
  });

  it('should return CSS minmax function if the specified width is less than 200', () => {
    // given
    const columns = [{width: 180, visible: true}] as DataGridColumnWithId[];
    const expected = 'minmax(150px, 180px)';

    // when
    const result = toColumnsStyle(columns);

    // then
    expect(result).toBe(expected);
  });

  it('should return style for the specified width', () => {
    // given
    const columns = [{width: 220, visible: true}] as DataGridColumnWithId[];
    const expected = '220px';

    // when
    const result = toColumnsStyle(columns);

    // then
    expect(result).toBe(expected);
  });

  it('should return style for multiple columns', () => {
    // given
    const columns = [
      {visible: true},
      {width: 250, visible: true},
      {width: 100, visible: true}
    ] as DataGridColumnWithId[];
    const expected = 'minmax(150px, 1.4fr) 250px minmax(150px, 100px)';

    // when
    const result = toColumnsStyle(columns);

    // then
    expect(result).toBe(expected);
  });

});
