export class GridConfig {
  visible: boolean;
  pagination: PaginationConfig;
  checkboxSelection: boolean;
  selectedRowsIndexes: number[];

  constructor(config: GridConfig) {
    this.visible = config.visible;
    this.pagination = config.pagination;
    this.checkboxSelection = config.checkboxSelection;
    this.selectedRowsIndexes = config.selectedRowsIndexes;
  }
}

export interface PaginationConfig {
  enabled: boolean;
  paginationPageSize: number;
  paginationPageSizeValues: number[];
  currentPage: number;
  numberOfPages: number;
}

export class GridConfigBuilder {
  visible = true;
  checkboxSelection = false;
  selectedRowsIndexes = [];
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

  withCheckboxSelection(checkbox: boolean) {
    this.checkboxSelection = checkbox;
    return this;
  }

  withselectedRowsIndexes(ids: number[]){
    this.selectedRowsIndexes = ids;
    return this;
  }

  build() {
    return new GridConfig({
      visible: this.visible,
      pagination: this.pagination,
      checkboxSelection: this.checkboxSelection,
      selectedRowsIndexes: this.selectedRowsIndexes
    });
  }

}
