import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, Output, NgModule } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

const getArrowClass = R.cond([[R.equals('ASC'), R.always('arrow-up')], [R.equals('DESC'), R.always('arrow-down')], [R.T, R.always('')]]);

@Component({
  selector: 'pcs-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() data: Array<any>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() config: GridConfig;

  @Output() sortGrid = new EventEmitter();

  componentFactories: ComponentFactory<any>[];

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  private createComponentFactories(components: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: components,
      entryComponents: components
    })
    class EntryComponentsModule { }

    return this.compiler.compileModuleAndAllComponentsSync(EntryComponentsModule).componentFactories;
  }

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    return R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig), this.data);
  }

  get headers() {
    return R.map(configItem => configItem.headerName, this.columnConfig);
  }

  onSortGrid(columnConfigId: number) {
    const item = this.columnConfig[columnConfigId];
    if (item.sortable) {
      this.sortGrid.emit(R.assoc('sortType', R.isNil(item.sortType) ? 'DESC' : item.sortType === 'ASC' ? null : 'ASC', item));
    }
  }

  getArrow(columnConfigId: number) {
    return getArrowClass(this.columnConfig[columnConfigId].sortType);
  }

  headerClass(index: number) {
    return 'text-white col ' + this.getArrow(index);
  }
}
