import { Compiler, Component, ComponentFactory, Input, NgModule, OnInit, Renderer2 } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/Config';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() config: Array<ColumnConfig>;

  componentFactories: ComponentFactory<any>[];
  componentFactoriesByName: object = {};
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;

  constructor(private renderer: Renderer2, private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
    const byName = R.groupBy((factory: ComponentFactory<any>) => factory.componentType.name);
    this.componentFactoriesByName = byName(this.componentFactories);
  }

  ngOnInit(): void {
    const allArray = R.map(dataItem => {
      return R.map(configItem => ({
        config: configItem,
        data: dataItem[configItem.field]
      }), this.config);
    }, this.data);
    this.dataAndConfig = [...allArray];
    this.headers = R.map(configItem => configItem.headerName, this.config);
  }

  private createComponentFactories(component: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: component,
      entryComponents: component
    })
    class EntryComponent { }

    return this.compiler.compileModuleAndAllComponentsSync(EntryComponent).componentFactories;
  }
}
