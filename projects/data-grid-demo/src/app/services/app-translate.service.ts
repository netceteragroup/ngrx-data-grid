import { Injectable } from '@angular/core';
import { GridTranslateService } from 'ngrx-data-grid';

@Injectable()
export class AppTranslateService implements GridTranslateService {
  private localeTexts = {
    'grid.columnSelector.title': 'My Columns',
    'grid.pagination.itemsPerPage': 'Items per page:',
    'grid.filter.apply': 'Filter',
    'grid.filter.clear': 'Clear',
    'grid.filter.none': 'None',
    'grid.filter.contains': 'Contains',
    'grid.filter.notContains': 'Not Contains',
    'grid.filter.notEqual': 'Not Equals',
    'grid.filter.startsWith': 'Starts With',
    'grid.filter.endsWith': 'Ends With',
    'grid.filter.lessThan': 'Less Than',
    'grid.filter.lessThanOrEquals': 'Less Than Or Equals',
    'grid.filter.greaterThan': 'Greater Than',
    'grid.filter.greaterThanOrEquals': 'Greater Than Or Equal',
    'grid.filter.false': 'False',
    'grid.filter.true': 'True'
  };

  translate(key: string) {
    return this.localeTexts[key] || '--not translated --';
  }

}
