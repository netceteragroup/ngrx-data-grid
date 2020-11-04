import * as R from 'ramda';
import { getVisibleColumns } from './grid-columns';
import { DataGridColumnWithId } from '../models';

export interface ColumnsStyle {
  'grid-template-columns': string;
}

const minmaxStyle = (width: string): string => `minmax(150px, ${width})`;

const MIN_ALLOWED_WIDTH = 1;
const DEFAULT_MAX_WIDTH = '1.4fr';
const DEFAULT_WIDTH = minmaxStyle(DEFAULT_MAX_WIDTH);
export const MIN_HEADER_NAME_WIDTH = 60;

const isWidthAllowed = R.lte(MIN_ALLOWED_WIDTH);
const inPixels = (width: number) => `${width}px`;
const widthStyle = R.compose(minmaxStyle, inPixels);

const toWidthInPixels = R.ifElse(
  isWidthAllowed,
  inPixels,
  widthStyle
);

const hasWidth = R.has('width');
const getWidth = R.prop('width');

const toWidth = R.ifElse(
  hasWidth,
  R.compose(toWidthInPixels, getWidth),
  R.always(DEFAULT_WIDTH)
);

type ToColumnsStyle = (columns: DataGridColumnWithId[]) => string;
export const toColumnsStyle: ToColumnsStyle = R.compose(
  R.join(' '),
  R.map(toWidth),
  getVisibleColumns
);
