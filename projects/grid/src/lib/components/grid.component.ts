import { Compiler, Component, ComponentFactory, Input, NgModule, OnInit } from '@angular/core';
import * as R from 'ramda';
import { select, Store } from '@ngrx/store';
import { getGridData, getCellConfig, getGridConfig, State } from '@grid/store';
import { InitGridData, InitColumnConfig, InitGridConfig } from '@grid/store/grid-actions';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig, GridConfig } from '@grid/config/column-config';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() config: Array<ColumnConfig>;
  @Input() gridConfig: GridConfig;

  componentFactories: ComponentFactory<any>[];
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;

  constructor(private entryService: EntryComponentsService, private compiler: Compiler, private store: Store<State>) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  ngOnInit(): void {
    this.store.dispatch(new InitGridData(this.data));
    this.store.dispatch(new InitColumnConfig(this.config));
    // this.store.dispatch(new InitGridConfig());
    this.dataAndConfig = R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.config), this.data);
    this.headers = R.map(configItem => configItem.headerName, this.config);
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
