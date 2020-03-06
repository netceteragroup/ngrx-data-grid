import { resolveGridName } from './grid-name-resolver';

describe('GridNameResolver', () => {

  it('Convert given value to boolean', () => {
    // given
    const index = 1;
    const expected = 'detail-grid-1';

    // when
    const result = resolveGridName(index);

    // then
    expect(result).toEqual(expected);
  });

});
