import { Injectable } from '@angular/core';
import * as R from 'ramda';

@Injectable()
export class FilterManagerService {
  filters = {};

  addFilters(filters) {
    R.flatten(filters).forEach(filter => {
      this.filters[filter.name] = Reflect.get(filter.prototype, 'filter');
    });
  }

  remove(filters) {

  }

}
