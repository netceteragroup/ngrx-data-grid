import { isDefined, isNotEqual, isNotNil, toBoolean, toNumber, toString } from './type';

describe('Type', () => {

  it('Check if given value is defined', () => {

    expect(isDefined('')).toBeTruthy();
    expect(isDefined(null)).toBeTruthy();
    expect(isDefined(2)).toBeTruthy();
    expect(isDefined({})).toBeTruthy();
    expect(isDefined({id: 1})).toBeTruthy();

    expect(isDefined(undefined)).toBeFalsy();
  });

  it('Check if a value is not equal to given value', () => {

    expect(isNotEqual('')(12)).toBeTruthy();
    expect(isNotEqual('test')('test2')).toBeTruthy();
    expect(isNotEqual({id: 1})({id: 2})).toBeTruthy();
    expect(isNotEqual('')(null)).toBeTruthy();
    expect(isNotEqual(12)(21)).toBeTruthy();
    expect(isNotEqual(12)('12')).toBeTruthy();

    expect(isNotEqual(12)(12)).toBeFalsy();
    expect(isNotEqual('test')('test')).toBeFalsy();
    expect(isNotEqual({})({})).toBeFalsy();
    expect(isNotEqual({id: 2})({id: 2})).toBeFalsy();

  });

  it('Check if given value is not nul', () => {

    expect(isNotNil(null)).toBeFalsy();
    expect(isNotNil(undefined)).toBeFalsy();

    expect(isNotNil(0)).toBeTruthy();
    expect(isNotNil([])).toBeTruthy();
    expect(isNotNil({})).toBeTruthy();
    expect(isNotNil('')).toBeTruthy();
  });

  it('Convert given value to number', () => {

    expect(toNumber(null)).toBe(null);
    expect(toNumber(undefined)).toBe(null);

    expect(toNumber('12')).toBe(12);
    expect(toNumber(' 3224 ')).toBe(3224);
  });

  it('Convert given value to string', () => {

    expect(toString(null)).toBe('');
    expect(toString(undefined)).toBe('');

    expect(toString('test')).toBe('test');
    expect(toString(22)).toBe('22');
    expect(toString(true)).toBe('true');
  });

  it('Convert given value to boolean', () => {

    expect(toBoolean(null)).toBe(null);
    expect(toBoolean(undefined)).toBe(null);

    expect(toBoolean('true')).toBe(true);
    expect(toBoolean('false')).toBe(false);
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(false)).toBe(false);
  });

});
