import { Component } from '@angular/core';
import { ColumnConfig, GridConfig } from '@grid/config/Config';
import * as R from 'ramda';
import { CellComponent } from './mockComponents/cell.component';
import { TextComponent } from './mockComponents/text.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pcs-grid';
  data: object[];
  config: ColumnConfig[];
  gridConfig: GridConfig;

  constructor() {
    this.gridConfig={
      visable: true
    };
    this.data = [{
      'userId': 'd66f8066-547f-41ff-b9b8-ae3a0e10705d',
      'mail': 'uzimmerman0@goo.gl',
      'age': 43,
      'skills': ['Biopharmaceuticals', 'HACCP'],
      'experience': [{
        'title': 'Librarian',
        'company': 'Divavu',
        'from': {'fromDate': 1020368095429, 'localDate': [2009, 2000, 2005], 'localTime': [2, 34, 11, 20, 30, 40]},
        'to': {'toDate': 1267791872231, 'localDate': [24, 7, 27], 'localTime': [23, 54, 11, 31, 58, 49]},
        'current': false
      }],
      'social': {'youtube': 'https://www.youtube.com/Cras', 'linkedIn': 'https://wwww.linkedin.com/Etiam', 'instagram': 'https://www.instagram.com/Nulla'},
      'isStudent': false
    },
      {
        'userId': '5f71e5ad-0061-4611-b43f-7691a4685628',
        'mail': 'bgrotty1@goo.ne.jp',
        'age': 36,
        'skills': ['European Union', 'Classroom'],
        'experience': [{
          'title': 'Geological Engineer',
          'company': 'Dabshots',
          'from': {'fromDate': 952155516036, 'localDate': [2011, 2013, 2005], 'localTime': [23, 53, 18, 27, 33, 55]},
          'to': {'toDate': 1152654179031, 'localDate': [5, 4, 17], 'localTime': [36, 5, 8, 53, 7, 25]},
          'current': true
        }],
        'social': {'youtube': 'https://www.youtube.com/Nullam', 'linkedIn': 'https://wwww.linkedin.com/Quisque', 'instagram': 'https://www.instagram.com/Cras'},
        'isStudent': false
      },
      {
        'userId': '5ac87e9f-2163-4fe0-aa98-7adac31fb7b0',
        'mail': 'cevershed2@loc.gov',
        'age': 45,
        'skills': ['Distance Learning', 'Flight Training'],
        'experience': [{
          'title': 'Electrical Engineer',
          'company': 'Wikido',
          'from': {'fromDate': 1103419914425, 'localDate': [2018, 2006, 2006], 'localTime': [14, 51, 19, 57, 22, 57]},
          'to': {'toDate': 1328025542673, 'localDate': [12, 30, 21], 'localTime': [23, 22, 38, 57, 40, 23]},
          'current': true
        }, {
          'title': 'VP Marketing',
          'company': 'Plajo',
          'from': {'fromDate': 1174206400625, 'localDate': [2006, 2015, 2008], 'localTime': [32, 19, 8, 16, 1, 45]},
          'to': {'toDate': 1440953181651, 'localDate': [13, 11, 20], 'localTime': [18, 59, 46, 33, 4, 16]},
          'current': false
        }],
        'social': {'youtube': 'https://www.youtube.com/Morbi', 'linkedIn': 'https://wwww.linkedin.com/Maecenas', 'instagram': 'https://www.instagram.com/Etiam'},
        'isStudent': false
      },
      {
        'userId': '54e81509-a232-460c-995c-34b8ffa42652',
        'mail': 'ctheurer3@hhs.gov',
        'age': 21,
        'skills': ['MRTG', 'Oracle SQL Developer'],
        'experience': [{
          'title': 'Occupational Therapist',
          'company': 'Teklist',
          'from': {'fromDate': 1354658132350, 'localDate': [2009, 2003, 2018], 'localTime': [32, 52, 7, 38, 57, 50]},
          'to': {'toDate': 1052178244522, 'localDate': [11, 30, 5], 'localTime': [50, 44, 23, 43, 15, 40]},
          'current': false
        }],
        'social': {'youtube': 'https://www.youtube.com/Donec', 'linkedIn': 'https://wwww.linkedin.com/Nam', 'instagram': 'https://www.instagram.com/Aliquam'},
        'isStudent': true
      }];

    this.config = [{
      headerName: 'id',
      field: 'userId',
      component: CellComponent,
      isVisible: false
    }, {
      headerName: 'mail',
      field: 'mail',
      component: CellComponent,
      isVisible: false
    }, {
      headerName: 'age',
      field: 'age',
      component: CellComponent,
      isVisible: false
    }, {
      headerName: 'skills',
      field: 'skills',
      component: CellComponent,
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
      component: CellComponent,
      isVisible: false,
      valueGetter: (value) => `${value.youtube} ${value.linkedIn} ${value.instagram}`
    }, {
      headerName: 'isStudent',
      field: 'isStudent',
      component: CellComponent,
      isVisible: false
    }];
  }
}
