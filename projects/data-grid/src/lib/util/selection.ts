import { SelectionType } from '../config';

export const isCheckboxSelection = (type: SelectionType) => type === SelectionType.Checkbox;

export const isRadioSelection = (type: SelectionType) => type === SelectionType.Radio;
