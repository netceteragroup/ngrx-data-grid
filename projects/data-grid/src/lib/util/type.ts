import * as R from 'ramda';

export const isDefined: any = R.complement(R.equals(undefined));
export const isNotEqual: any = R.complement(R.equals);
export const isNotNil: any = R.complement(R.isNil);
export const isNotEmpty: any = R.complement(R.isEmpty);

type HasValue = (v: any) => boolean;
export const hasValue: HasValue = R.allPass([isNotEmpty, isNotNil]);
export const hasNoValue: any = R.complement(hasValue);

export const isTrue: any = R.equals(true);
export const isFalse: any = R.complement(isTrue);

export const mapIndexed: any = R.addIndex(R.map);

export const isString: any = R.is(String);
const trimIfString = R.ifElse(
  isString,
  R.trim,
  R.identity
);

export const toNumber: any = R.ifElse(
  hasValue,
  R.compose(Number, trimIfString),
  R.always(null)
);

export const toString: any = R.ifElse(hasValue, String, R.always(''));

export const toBoolean: any = R.ifElse(
  hasValue,
  R.anyPass([R.equals(true), R.equals('true')]),
  R.always(null)
);
