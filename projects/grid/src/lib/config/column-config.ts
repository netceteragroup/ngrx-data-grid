export interface ColumnConfig {
  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  valueFormatter?: Function;
  valueGetter?: Function;
}

export interface DataAndConfig {
  data: any;
  config: ColumnConfig;
}
<<<<<<< HEAD

export interface GridConfig {
  visable: boolean;
}
=======
>>>>>>> 683b102dc47ac8e17e70aa73ce321a50b3d38f80
