export class GridConfig {
  visible: boolean;
  pagination: PaginationConfig;
  selection: SelectionConfig;
  columnSelection: boolean;

  constructor(config: GridConfig) {
    this.visible = config.visible;
    this.pagination = config.pagination;
    this.selection = config.selection;
    this.columnSelection = config.columnSelection;
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

  build() {
    return new GridConfig({
      visible: this.visible,
      pagination: this.pagination,
      selection: this.selection,
      columnSelection: this.columnSelection
    });
  }

}
