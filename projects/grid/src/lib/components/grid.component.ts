import { Compiler, Component, ComponentFactory, Input, NgModule, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { CellDirective } from '@grid/directives/cell.directive';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig, GridConfig } from '@grid/config/Config';
import { select, Store } from '@ngrx/store';
import { getGridData, getCellConfig, getGridConfig, State } from '@grid/store';
import { InitGridData, InitColumnConfig, InitGridConfig } from '@grid/store/grid-actions';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() config: Array<ColumnConfig>;
  @Input() gridConfig: GridConfig;

  componentFactoriesGenerator: ComponentFactory<any>[];
  componentFactories: object = {};
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  constructor(private renderer: Renderer2, private entryService: EntryComponentsService, private compiler: Compiler, private store: Store<State>) {
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
    this.store.dispatch(new InitGridData(this.data));
    this.store.dispatch(new InitColumnConfig(this.config));
    // this.store.dispatch(new InitGridConfig());
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
