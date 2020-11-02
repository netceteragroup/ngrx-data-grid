export class GridConfig {
  visible: boolean;
  pagination: PaginationConfig;
  selection: SelectionConfig;
  columnSelection: boolean;
  masterDetail: boolean;
  detailGridConfig: GridConfig;
  columnReorder: boolean;
  columnResize: boolean;

  constructor(config: GridConfig) {
    this.visible = config.visible;
    this.pagination = config.pagination;
    this.selection = config.selection;
    this.columnSelection = config.columnSelection;
    this.masterDetail = config.masterDetail;
    this.detailGridConfig = config.detailGridConfig;
    this.columnReorder = config.columnReorder;
    this.columnResize = config.columnResize;
  }
}

export interface PaginationConfig {
  enabled: boolean;
  paginationPageSize: number;
  paginationPageSizeValues: number[];
  currentPage: number;
  numberOfPages: number;
}

export enum SelectionType {
  Checkbox = 'checkbox',
  Radio = 'radio'
}

export interface SelectionConfig {
  selectedRowsIds: number[];
  type: SelectionType;
}

export class GridConfigBuilder {
  visible = true;
  selection = {
    selectedRowsIds: [],
    type: null
  };
  pagination = {
    enabled: true,
    paginationPageSize: 5,
    paginationPageSizeValues: [5, 10, 20, 50, 100, 200],
    currentPage: 0,
    numberOfPages: 0
  };
  columnSelection = true;
  masterDetail = false;
  detailGridConfig: GridConfig = null;
  columnReorder = false;
  columnResize = false;

  static gridConfig() {
    return new GridConfigBuilder();
  }

  withVisibility(visible: boolean) {
    this.visible = visible;
    return this;
  }

  withSelection(type: SelectionType) {
    this.selection.type = type;
    return this;
  }

  withColumnSelection(columnSelection = true) {
    this.columnSelection = columnSelection;
    return this;
  }

  withMasterDetail(masterDetail = true) {
    this.masterDetail = masterDetail;
    return this;
  }

  withDetailGridConfig(detailGridConfig: GridConfig) {
    this.detailGridConfig = detailGridConfig;
    return this;
  }

  withColumnReorder(columnReorder = true) {
    this.columnReorder = columnReorder;
    return this;
  }

  withColumnResize(columnResize = true) {
    this.columnResize = columnResize;
    return this;
  }

  build() {
    return new GridConfig({
      visible: this.visible,
      pagination: this.pagination,
      selection: this.selection,
      columnSelection: this.columnSelection,
      masterDetail: this.masterDetail,
      detailGridConfig: this.detailGridConfig,
      columnReorder: this.columnReorder,
      columnResize: this.columnResize
    });
  }

}
