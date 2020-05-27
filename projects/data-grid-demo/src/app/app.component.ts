import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataGridColumn, FilteringOptions, FilterType, getGridByName, GridConfig, GridConfigBuilder, hasData, initGrid, SelectionType, updateGridData } from 'ngrx-data-grid';
import * as R from 'ramda';
import { NumberComponent } from './components/number.component';
import { MockService } from './mock/mock.service';
import { formatDate } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { TextComponent } from './components/text.component';
import { getGridState } from './reducers';
import { BadgesColumnComponent } from './components/badge/badges-column.component';
import { DateFilterComponent } from './components/date-filter.component';
import { ExperienceFilterComponent } from './components/experience-filter.component';
import { resetGridState } from '../../../data-grid/src/lib/actions/data-grid-actions';
import { take } from 'rxjs/operators';

const dateFormat = 'MM-dd-yyyy';
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
  gridState$;

  constructor(private store: Store<any>) {
    this.config = GridConfigBuilder.gridConfig()
      .withSelection(SelectionType.Checkbox)
      .withMasterDetail(true)
      .withDetailGridConfig(GridConfigBuilder.gridConfig()
        .withColumnSelection(false)
        .build()
      )
      .build();

    this.data = new MockService().getData().rows;
    this.data[0].badges = {
      requester: [{id: 1, status: {id: 'A'}}, {id: 2, status: {id: 'P'}}],
      manager: [{id: 3, status: {id: 'U'}}, {id: 4, status: {id: 'P'}}],
      coordinator: [{id: 5, status: {id: 'A'}}, {id: 6, status: {id: 'R'}}]
    };
    this.data[0].mail = null;
    this.data[0].age = null;
    this.data.forEach(d => {
      d.details = [
        {
          id: 1,
          firstName: 'Detail 1',
          lastName: 'Detail 2'
        },
        {
          id: 2,
          firstName: 'Detail 3',
          lastName: 'Detail 4'
        }
      ];
    });
    this.columnConfig = this.createColumnConfig();

    this.gridState$ = this.store.pipe(select(getGridState));
    this.gridState$.pipe(select(hasData, {gridName: this.gridName}))
      .subscribe(hasResults => console.log('hasData: ', hasResults));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.onInitialize();
    }, 1000);
  }

  private createColumnConfig() {
    const dateComparator = (dataItem1, dataItem2) => {
      if (dataItem1.fromDate === dataItem2.fromDate) {
        return 0;
      }

      return dataItem1.fromDate > dataItem2.fromDate ? 1 : -1;
    };

    return [{
      headerName: 'id',
      field: 'userId',
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Text
      },
      component: TextComponent,
      width: 350
    }, {
      headerName: 'Badges',
      field: 'badges',
      visible: true,
      sortAvailable: false,
      filterAvailable: false,
      component: BadgesColumnComponent,
      width: 150
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
      component: TextComponent,
      width: 250
    }, {
      headerName: 'age',
      field: 'age',
      component: NumberComponent,
      visible: true,
      sortAvailable: false,
      filterAvailable: false,
      width: 50
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
      },
      width: 250
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
      comparator: dateComparator,
      filter: {
        component: DateFilterComponent
      },
      width: 150
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
      },
      width: 300
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: TextComponent,
      visible: true,
      sortAvailable: true,
      filterAvailable: true,
      filter: {
        filterType: FilterType.Boolean
      },
      width: 150
    }];
  }

  createDetailColumns() {
    return [
      {
        headerName: 'ID',
        field: 'id',
        visible: true,
        sortAvailable: false,
        filterAvailable: false,
        component: TextComponent
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        visible: true,
        sortAvailable: true,
        filterAvailable: true,
        filter: {
          filterType: FilterType.Text
        },
        component: TextComponent
      }, {
        headerName: 'Last Name',
        field: 'lastName',
        visible: true,
        sortAvailable: false,
        filterAvailable: false,
        component: TextComponent
      }
    ];
  }

  onUpdateMailOfFirstElement(newMailValue, userId) {
    this.store.dispatch(updateGridData({
      name: 'gridTest',
      shouldUpdate: (gridElement) => gridElement.userId === userId,
      update: (gridElement) => R.mergeRight(gridElement, {
        mail: newMailValue
      })
    }));
  }

  initializeWithCheckboxSelection() {
    this.config = GridConfigBuilder.gridConfig()
      .withSelection(SelectionType.Checkbox)
      .build();

    this.onInitialize();
  }

  initializeWithRadioSelection() {
    this.config = GridConfigBuilder.gridConfig()
      .withSelection(SelectionType.Radio)
      .build();

    this.onInitialize();
  }

  onInitialize() {
    this.store.dispatch(initGrid({
      name: this.gridName,
      data: this.data,
      columns: this.columnConfig,
      paginationPageSize: 5
    }));
  }

  onResetGridState() {
    this.store.dispatch(resetGridState({name: this.gridName}));
  }

  onOpenDetails({rowData, name, rowIndex}) {
    this.gridState$.pipe(select(getGridByName, {gridName: name})).pipe(
      take(1)
    ).subscribe((detailGrid) => {
      if (detailGrid) {
        this.store.dispatch(initGrid({
          name,
          data: detailGrid.data,
          columns: this.createDetailColumns(),
          paginationPageSize: 5,
          parent: this.gridName
        }));
      } else {
        setTimeout(() => {
          this.store.dispatch(initGrid({
            name,
            data: rowData.details,
            columns: this.createDetailColumns(),
            paginationPageSize: 5,
            parent: this.gridName
          }));
        }, 1000);
      }
    });
  }
}
