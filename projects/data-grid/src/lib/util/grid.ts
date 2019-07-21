import * as R from 'ramda';
import { ColumnConfig } from '../config';
import {hasValue} from './type';

const propertyExists = (func: any): (func: any) => Function | undefined => {
  return func || R.identity;
};

type ApplyValueGetterAndFormatter = (config: ColumnConfig) => Function;
export const applyValueGetterAndFormatter: ApplyValueGetterAndFormatter = (config: ColumnConfig) => R.compose(
  propertyExists(config.valueFormatter),
  propertyExists(hasValue(config.valueGetter) ? config.valueGetter : R.prop(config.field))
);
