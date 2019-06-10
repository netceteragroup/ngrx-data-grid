export class GridConfig {
  visable: boolean;
  constructor(configBuilder: GridConfigBuilder) {
    this.visable = configBuilder.visable;
  }
}

export class GridConfigBuilder {
  visable = true;

  static gridConfig() {
    return new GridConfigBuilder();
  }

  withVisability(visable: boolean) {
    this.visable = visable;
    return this;
  }

  build() {
    return new GridConfig({
      visable: this.visable,
      ...this
    });
  }

}
