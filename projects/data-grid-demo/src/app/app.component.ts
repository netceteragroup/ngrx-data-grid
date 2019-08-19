import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataGridColumn, FilterType, GridConfig, GridConfigBuilder, initGrid } from 'ngrx-data-grid';
import * as R from 'ramda';
import { NumberComponent } from './components/number.component';
import { MockService } from './mock/mock.service';
import { from } from 'rxjs';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { TextComponent } from './components/text.component';

const dateFormat = 'MM-LL-yyyy';
const dateToString = (date) => formatDate(date, dateFormat, 'en-US');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  gridName = 'gridTest';
  data: any[];
  columnConfig: DataGridColumn[];
  config: GridConfig;

  constructor(private store: Store<any>) {
    this.config = GridConfigBuilder.gridConfig().withCheckboxSelection(true);
    this.data = new MockService().getData().rows;
    this.columnConfig = this.createColumnConfig();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(initGrid({
        name: this.gridName,
        data: this.data,
        columns: this.columnConfig,
        paginationPageSize: 5
      }));
    }, 1000);
  }

  private createColumnConfig() {
    return [{
      headerName: 'id',
      field: 'userId',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Text
      }
    }, {
      headerName: 'mail',
      field: 'mail',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Text
      }
    }, {
      headerName: 'age',
      field: 'age',
      component: NumberComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Number
      }
    }, {
      headerName: 'skills',
      field: 'skills',
      component: TextComponent,
      visible: true,
      sortAvailable: false,
      filterAvailable: true,
      valueGetter: R.compose(R.join(','), R.path(['skills'])),
      filter: {
        filterType: FilterType.Text
      }
    }, {
      headerName: 'experience',
      field: 'experience',
      component: TextComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      valueGetter: R.compose(R.join(', '), R.map(R.prop('title')), R.path(['experience'])),
      filter: {
        filterType: FilterType.Text
      }
    }, {
      headerName: 'from',
      field: 'experience',
      component: TextComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      valueGetter: R.compose(dateToString, R.path(['from', 'fromDate']), R.head, R.path(['experience'])),
      filter: {
        filterType: FilterType.Date
      }
    }, {
      headerName: 'social',
      field: 'social',
      component: TextComponent,
      visible: true,
      sortAvailable: false,
      filterAvailable: true,
      valueGetter: (dataItem: any) => `${R.path(['social', 'youtube'])(dataItem)} ${R.path(['social', 'linkedIn'])(dataItem)} ${R.path(['social', 'instagram'])(dataItem)}`,
      filter: {
        filterType: FilterType.Text
      }
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: TextComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Boolean
      }
    }];
  }

}
