import { isCheckboxSelection, isRadioSelection } from './selection';
import { SelectionType } from '../config';

describe('Selection', () => {

  it('should return false for null', () => {
    // when
    const result = isCheckboxSelection(null);

    // then
    expect(result).toBeFalsy();
  });

  it('should return true for checkbox selection', () => {
    // when
    const result = isCheckboxSelection(SelectionType.Checkbox);

    // then
    expect(result).toBeTruthy();
  });

  it('should return false for non checkbox selection', () => {
    // when
    const result = isCheckboxSelection(SelectionType.Radio);

    // then
    expect(result).toBeFalsy();
  });

  it('should return true for radio selection', () => {
    // when
    const result = isRadioSelection(SelectionType.Radio);

    // then
    expect(result).toBeTruthy();
  });

  it('should return false for non radio selection', () => {
    // when
    const result = isRadioSelection(SelectionType.Checkbox);

    // then
    expect(result).toBeFalsy();
  });

});
