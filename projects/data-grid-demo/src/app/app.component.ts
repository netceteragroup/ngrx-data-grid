import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataGridColumn, FilterType, GridConfig, GridConfigBuilder, hasData, initGrid, FilteringOptions } from 'ngrx-data-grid';
import * as R from 'ramda';
import { NumberComponent } from './components/number.component';
import { MockService } from './mock/mock.service';
import { from } from 'rxjs';
import { formatDate } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { TextComponent } from './components/text.component';
import { getGridState } from './reducers';
import { BadgesColumnComponent } from './components/badge/badges-column.component';
import { DateFilterComponent } from './components/date-filter.component';
import { ExperienceFilterComponent } from './components/experience-filter.component';

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
    this.data[0].badges = {
      requester: [{id: 1, status: {id: 'A'}}, {id: 2, status: {id: 'P'}}],
      manager: [{id: 3, status: {id: 'U'}}, {id: 4, status: {id: 'P'}}],
      coordinator: [{id: 5, status: {id: 'A'}}, {id: 6, status: {id: 'R'}}]
    };
    this.columnConfig = this.createColumnConfig();

    const gridState$ = this.store.pipe(select(getGridState));
    gridState$.pipe(select(hasData, {gridName: this.gridName}))
      .subscribe(hasResults => console.log('hasData: ', hasResults));
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
      },
      component: TextComponent
    }, {
      headerName: 'Badges',
      field: 'badges',
      visible: true,
      sortAvailable: false,
      filterAvailable: false,
      component: BadgesColumnComponent
    }, {
      headerName: 'mail',
      field: 'mail',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Text,
        option: FilteringOptions.StartsWith,
        value: 'a'
      },
      component: TextComponent
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
        component: ExperienceFilterComponent
      }
    }, {
      headerName: 'from',
      field: 'fromDate',
      component: TextComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      valueGetter: R.compose(dateToString, R.prop('fromDate')),
      filter: {
        component: DateFilterComponent
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
