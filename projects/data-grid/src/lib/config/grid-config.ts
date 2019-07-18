export class GridConfig {
  visible: boolean;
  pagination: PaginationConfig;
  selection: SelectionConfig;

  constructor(config: GridConfig) {
    this.visible = config.visible;
    this.pagination = config.pagination;
    this.selection = config.selection;
  }
}

export interface PaginationConfig {
  enabled: boolean;
  paginationPageSize: number;
  paginationPageSizeValues: number[];
  currentPage: number;
  numberOfPages: number;
}

export interface SelectionConfig {
  checkboxSelection: boolean;
  selectedRowsIds: number[];
}

export class GridConfigBuilder {
  visible = true;
  selection = {
    checkboxSelection: false,
    selectedRowsIds: []
  };
  pagination = {
    enabled: true,
    paginationPageSize: 5,
    paginationPageSizeValues: [5, 10, 20, 50, 100, 200],
    currentPage: 0,
    numberOfPages: 0
  };

  static gridConfig() {
    return new GridConfigBuilder();
  }

  withVisability(visible: boolean) {
    this.visible = visible;
    return this;
  }

  withCheckboxSelection(enabled: boolean) {
    this.selection.checkboxSelection = enabled;
    return this;
  }

  build() {
    return new GridConfig({
      visible: this.visible,
      pagination: this.pagination,
      selection: this.selection
    });
  }

}
