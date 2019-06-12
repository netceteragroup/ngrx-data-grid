export class GridConfig {
  visible: boolean;
  constructor(config: GridConfig) {
    this.visible = config.visible;
  }
}

export class GridConfigBuilder {
  visible = true;

  static gridConfig() {
    return new GridConfigBuilder();
  }

  withVisability(visible: boolean) {
    this.visible = visible;
    return this;
  }

  build() {
    return new GridConfig({
      visible: this.visible
    });
  }

}
