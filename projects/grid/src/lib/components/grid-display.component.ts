import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, Output, NgModule } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

const getArrowClass = R.cond([
  [R.equals('asc'),  R.always('arrow-up')],
  [R.equals('desc'), R.always('arrow-down')],
  [R.T,              R.always('')]
]);

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
    return R.map(configItem => configItem.headerName, this.columnConfig);
  }

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }
  @Input() data: Array<any>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() config: GridConfig;

  @Output() sortGrid = new EventEmitter();

  componentFactories: ComponentFactory<any>[];

  onSortGrid(header: any, configItem: ColumnConfig) {
    this.sortGrid.emit(configItem);
  }

  getArrow(configItem: ColumnConfig) {
    return getArrowClass(configItem.sortType);
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
