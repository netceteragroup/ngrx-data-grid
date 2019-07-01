import { Component } from '@angular/core';
import { ColumnConfig } from '@grid/config/column-config';
import { GridConfig, GridConfigBuilder } from '@grid/config/grid-config';
import * as R from 'ramda';
import { PriceComponent } from './components/price.component';
import { TextComponent } from './components/text.component';
import { MockService } from './mock/mock.service';
import { InitGrid } from '@grid/actions/grid-actions';
import { Store } from '@ngrx/store';
import { State } from '@grid/store';
import { FilterType } from '@grid/config/filter-config';
import { from } from 'rxjs';

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
    this.config = GridConfigBuilder.gridConfig().withCheckboxSelection(true);
    this.data = new MockService().getData().rows;
    this.columnConfig = [{
      headerName: 'id',
      field: 'userId',
      component: PriceComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.textFilterType
      }
    }, {
      headerName: 'mail',
      field: 'mail',
      component: PriceComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.textFilterType
      }
    }, {
      headerName: 'age',
      field: 'age',
      component: PriceComponent,
      isVisible: true,
      sortable: true,
      filter: {
        type: FilterType.numberFilterType
      }
    }, {
      headerName: 'skills',
      field: 'skills',
      component: PriceComponent,
      isVisible: true,
      sortable: false,
      valueFormatter: (value) => value.join(','),
      filter: {
        type: FilterType.textFilterType
      }
    }, {
      headerName: 'experience',
      field: 'experience',
      component: TextComponent,
      isVisible: true,
      sortable: true,
      comparator: (a, b) => (b.experience[0].to.toDate - b.experience[0].from.fromDate) - (a.experience[0].to.toDate - a.experience[0].from.fromDate),
      valueFormatter: (value) => R.map((value1: any) => `${value1.title} ${value1.company} ${value1.from} ${value1.to} ${value1.current}`, value),
      filter: {
        type: FilterType.textFilterType
      }
    }, {
      headerName: 'from',
      field: 'experience',
      component: TextComponent,
      isVisible: true,
      sortable: true,
      comparator: (a, b) => (b.experience[0].to.toDate - b.experience[0].from.fromDate) - (a.experience[0].to.toDate - a.experience[0].from.fromDate),
      valueFormatter: (date) => {
        let fromDates = '';
        fromDates = fromDates
          + new Date(date.fromDate).getFullYear() + '-'
          + ('0' + (new Date(date.fromDate).getMonth() + 1)).slice(-2) + '-'
          + ('0' + (new Date(date.fromDate).getDay() + 1)).slice(-2) + ' ';
        return fromDates.trim();
      },
      valueGetter: (value) => R.head(value).from,
      filter: {
        type: FilterType.DateFilterType
      }
    }, {
      headerName: 'social',
      field: 'social',
      component: PriceComponent,
      isVisible: true,
      sortable: false,
      valueGetter: (value) => `${value.youtube} ${value.linkedIn} ${value.instagram}`,
      filter: {
        type: FilterType.textFilterType
      }
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: PriceComponent,
      isVisible: true,
      sortable: true,
      valueFormatter: (value) => value.toString(),
      filter: {
        type: FilterType.textFilterType
      }
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

  initGrid(data: Array<object>, columnConfig: Array<ColumnConfig>, config: GridConfig) {
    this.store.dispatch(new InitGrid({initialData: data, columnConfig: columnConfig, gridConfig: config}));
  }

}
