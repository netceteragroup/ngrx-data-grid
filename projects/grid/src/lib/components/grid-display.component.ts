import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, Input, NgModule } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

@Component({
  selector: 'pcs-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() data: Array<any>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() config: GridConfig;

  get dataAndConfig() {
    return R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig), this.data);
  }

  get headers() {
    return R.map(configItem => configItem.headerName, this.columnConfig);
  }

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
}
