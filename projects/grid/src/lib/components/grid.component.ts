import { Compiler, Component, ComponentFactory, Input, NgModule, OnInit } from '@angular/core';
import * as R from 'ramda';
import { select, Store } from '@ngrx/store';
import { getGridData, getColumnConfig, getGridConfig, State } from '@grid/store';
import { InitGridData, InitColumnConfig, InitGridConfig } from '@grid/store/grid-actions';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig } from '@grid/config/grid-config';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() config: GridConfig;

  componentFactories: ComponentFactory<any>[];
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;

  constructor(private entryService: EntryComponentsService, private compiler: Compiler, private store: Store<State>) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  ngOnInit(): void {
    this.store.dispatch(new InitGridData(this.data));
    this.store.dispatch(new InitColumnConfig(this.columnConfig));
    this.store.dispatch(new InitGridConfig(this.config));
    this.dataAndConfig = R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig), this.data);
    this.headers = R.map(configItem => configItem.headerName, this.columnConfig);
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
