import { Component, OnInit } from '@angular/core';
import { GridConfig, GridConfigBuilder, initGrid } from 'ngrx-data-grid';
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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gridName = 'grid-1';
  data: any[];
  columnConfig: any[];
  config: GridConfig;

  constructor(private store: Store<any>) {
    this.config = GridConfigBuilder.gridConfig().withCheckboxSelection(true);
    this.data = new MockService().getData().rows;
    this.columnConfig = [{
      headerName: 'id',
      field: 'userId',
      isVisible: true,
      componentInputName: 'data',
      sortable: true,
      filter: {
        type: 'Text'
      }
    }, {
      headerName: 'mail',
      field: 'mail',
      isVisible: true,
      componentInputName: 'data',
      sortable: true,
      filter: {
        type: 'Text'
      }
    }, {
      headerName: 'age',
      field: 'age',
      component: NumberComponent,
      isVisible: true,
      componentInputName: 'data',
      sortable: true,
      filter: {
        type: 'Number'
      }
    }, {
      headerName: 'skills',
      field: 'skills',
      component: TextComponent,
      isVisible: true,
      componentInputName: 'data',
      sortable: false,
      valueGetter: R.compose(R.join(','), R.path(['skills'])),
      filter: {
        type: 'Text'
      }
    }, {
      headerName: 'experience',
      field: 'experience',
      component: TextComponent,
      isVisible: true,
      sortable: true,
      componentInputName: 'data',
      comparator: (a, b) => (b.experience[0].to.toDate - b.experience[0].from.fromDate) - (a.experience[0].to.toDate - a.experience[0].from.fromDate),
      valueGetter: R.compose(R.join(', '), R.map(R.prop('title')), R.path(['experience'])),
      filter: {
        type: 'Text'
      }
    }, {
      headerName: 'from',
      field: 'experience',
      component: TextComponent,
      isVisible: true,
      sortable: true,
      componentInputName: 'data',
      comparator: (a, b) => (b.experience[0].to.toDate - b.experience[0].from.fromDate) - (a.experience[0].to.toDate - a.experience[0].from.fromDate),
      valueGetter: R.compose(dateToString, R.path(['from', 'fromDate']), R.head, R.path(['experience'])),
      filter: {
        type: 'Date'
      }
    }, {
      headerName: 'social',
      field: 'social',
      component: TextComponent,
      isVisible: true,
      componentInputName: 'data',
      sortable: false,
      valueGetter: (dataItem: any) => `${R.path(['social', 'youtube'])(dataItem)} ${R.path(['social', 'linkedIn'])(dataItem)} ${R.path(['social', 'instagram'])(dataItem)}`,
      filter: {
        type: 'Text'
      }
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: TextComponent,
      isVisible: true,
      componentInputName: 'data',
      sortable: true,
      filter: {
        type: 'Boolean'
      }
    }];
  }

  ngOnInit(): void {
    this.store.dispatch(initGrid({name: 'grid-1', data: this.data, columns: this.prepareGridColumns(), paginationPageSize: 5}));
  }

  prepareGridColumns(): any {
    return R.map((columnConfig: any) => {
      const {field, headerName, isVisible: visible, sortable: sortAvailable, filter, valueGetter, component} = columnConfig;

      return {
        headerName,
        field,
        visible,
        sortAvailable, filterAvailable: !R.isNil(filter),
        filter: !R.isNil(filter) ? {filterType: filter.type} : null,
        valueGetter,
        component
      };
    })(this.columnConfig);
  }

}
