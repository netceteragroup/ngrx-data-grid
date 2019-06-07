export class GridConfig {
  visable: boolean;
  constructor(configBuilder: GridConfigBuilder) {
    this.visable = configBuilder.visable;
  }
}

export class GridConfigBuilder {
  private _visable = true;

  setVisability(visable: boolean) {
    this._visable = visable;
    return this;
  }

  build() {
    return new GridConfig(this);
  }

  get visable() {
    return this._visable;
  }
}
