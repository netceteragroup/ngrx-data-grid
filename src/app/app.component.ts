import { Component } from '@angular/core';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, GridConfigBuilder } from '@grid/config/grid-config';
import * as R from 'ramda';
import { PriceComponent } from './components/price.component';
import { TextComponent } from './components/text.component';
import { MockService } from './mock/mock.service';
import { InitGrid } from '@grid/actions/grid-actions';
import { select, Store } from '@ngrx/store';
import { getGridData, getColumnConfig, getGridConfig, State } from '@grid/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pcs-grid';
  data: Object[];
  columnConfig: ColumnConfig[];
  config: GridConfig;

  constructor(private store: Store<State>) {
    this.config = GridConfigBuilder.gridConfig();
    this.data = new MockService().getData().rows;
    this.columnConfig = [{
      headerName: 'id',
      field: 'userId',
      component: PriceComponent,
      isVisible: false
    }, {
      headerName: 'mail',
      field: 'mail',
      component: PriceComponent,
      isVisible: false
    }, {
      headerName: 'age',
      field: 'age',
      component: PriceComponent,
      isVisible: false
    }, {
      headerName: 'skills',
      field: 'skills',
      component: PriceComponent,
      isVisible: false,
    }, {
      headerName: 'experience',
      field: 'experience',
      component: TextComponent,
      isVisible: false,
      valueFormatter: (value) => R.map((value1: any) => `${value1.title} ${value1.company} ${value1.from} ${value1.to} ${value1.current}`, value)
    }, {
      headerName: 'social',
      field: 'social',
      component: PriceComponent,
      isVisible: false,
      valueGetter: (value) => `${value.youtube} ${value.linkedIn} ${value.instagram}`
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: PriceComponent,
      isVisible: false
    }];
  }

  sendAllData() {
    this.initGrid(this.data, this.columnConfig, this.config);
  }

  sendRandomData() {
    const randomData = new MockService().getRandomData();
    this.initGrid(
      randomData.rows,
      R.filter(column =>
        R.contains(column.field, randomData.columns)
        , this.columnConfig),
      this.config
    );
  }

  initGrid(data, columnConfig, config) {
    this.store.dispatch(new InitGrid(data, columnConfig, config));
  }

}
