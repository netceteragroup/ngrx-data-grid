import * as R from 'ramda';
import { ColumnConfig } from '@grid/config/column-config';

const propertyExists = (func: any): (func: any) => Function | undefined => {
  return func || R.identity;
};

type ApplyValueGetterAndFormatter = (config: ColumnConfig) => Function;
export const applyValueGetterAndFormatter: ApplyValueGetterAndFormatter = (config: ColumnConfig) => R.compose(
  propertyExists(config.valueFormatter),
  propertyExists(config.valueGetter)
);
