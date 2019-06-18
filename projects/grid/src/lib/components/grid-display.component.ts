import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, Output, NgModule } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

@Component({
  selector: 'pcs-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    return R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig), this.data);
  }

  get headers() {
    return R.map(configItem => configItem.headerName + this.getArrow(configItem), this.columnConfig);
  }

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }
  @Input() data: Array<any>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() config: GridConfig;

  @Output() sortGrid = new EventEmitter();

  componentFactories: ComponentFactory<any>[];

  onSortGrid(header: any, columnConfig: ColumnConfig[]) {
    this.sortGrid.emit(R.find(R.propEq('headerName', header.split(' ').splice(0, 1).toString()))(columnConfig));
  }

  getArrow(configItem: ColumnConfig) {
    const arrow = R.cond([
      [R.equals('asc'),  R.always(' \u2193')],
      [R.equals('desc'), R.always(' \u2191')],
      [R.T,              R.always('')]
    ]);
    return arrow(configItem.sorted);
  }

  private createComponentFactories(components: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: components,
      entryComponents: components
    })
    class EntryComponentsModule { }

    return this.compiler.compileModuleAndAllComponentsSync(EntryComponentsModule).componentFactories;
  }
}
