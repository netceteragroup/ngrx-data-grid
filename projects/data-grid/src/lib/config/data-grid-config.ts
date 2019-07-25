export class DataGridConfig {
  pagination: boolean;
  selection: boolean;

  constructor({pagination = false, selection = false}) {
    this.pagination = pagination;
    this.selection = selection;
  }
}
