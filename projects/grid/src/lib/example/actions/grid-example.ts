import { Action } from '@ngrx/store';

export enum GridExampleActionTypes {
  AddNewRow = '[Example] Add New Row',
  AddNewColumn = '[Example] Add New Column'
}

export class AddNewRow implements Action {
  readonly type = GridExampleActionTypes.AddNewRow;
}

export class AddNewColumn implements Action {
  readonly type = GridExampleActionTypes.AddNewColumn;
}
