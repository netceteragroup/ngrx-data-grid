import { Compiler, Component, ComponentFactory, Input, NgModule, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { CellDirective } from '@grid/directives/cell.directive';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/Config';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() config: Array<ColumnConfig>;

  componentFactoriesGenerator: ComponentFactory<any>[];
  componentFactories: object = {};
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  constructor(private renderer: Renderer2, private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactoriesGenerator = this.createComponent(this.compiler, this.entryService.entryComponentsArray);
    R.map(componentFactory => {
      this.componentFactories[componentFactory.componentType.name] = componentFactory;
    }, this.componentFactoriesGenerator);
  }

  createComponent(compiler: Compiler, component: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: component,
      entryComponents: component
    })
    class EntryComponent {
      constructor() {
      }
    }

    return compiler.compileModuleAndAllComponentsSync(EntryComponent).componentFactories;
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
}
