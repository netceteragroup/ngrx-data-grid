import { Component } from '@angular/core';

interface Config {
  headerName: string;
  field: string;
  component: any;
  valueFormatter?: Function;
  valueGetter?: Function;
  isVisible: boolean;
}

export class ColumnConfig implements Config {

  component: any;
  field: string;
  headerName: string;
  isVisible: boolean;
  valueFormatter?: Function;
  valueGetter?: Function;

  constructor(headerName: string = '', field: string = '', component: Component = null, isVisible: boolean = false, valueFormatter: Function = null, valueGetter: Function = null) {
    this.headerName = headerName;
    this.field = field;
    this.component = component;
    this.isVisible = isVisible;
    this.valueFormatter = valueFormatter;
    this.valueGetter = valueGetter;
  }
}

export interface DataAndConfig {
  data: any;
  config: ColumnConfig;
}

export interface GridConfig {
  visable: boolean;
}
