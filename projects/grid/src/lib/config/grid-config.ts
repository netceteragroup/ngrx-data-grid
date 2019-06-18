export class GridConfig {
  visible: boolean;
  pagination: PaginationConfig;

  constructor(config: GridConfig) {
    this.visible = config.visible;
    this.pagination = config.pagination;
  }
}

export interface PaginationConfig {
  enabled: boolean;
  paginationPageSize: number;
  paginationPageSizeValues: number[];
  currentPage: number;
}

export class GridConfigBuilder {
  visible = true;
  pagination = {
    enabled: true,
    paginationPageSize: 5,
    paginationPageSizeValues: [5, 10, 20, 50, 100, 200],
    currentPage: 0
  };

  static gridConfig() {
    return new GridConfigBuilder();
  }

  withVisability(visible: boolean) {
    this.visible = visible;
    return this;
  }

  build() {
    return new GridConfig({
      visible: this.visible,
      pagination: this.pagination
    });
  }

}
