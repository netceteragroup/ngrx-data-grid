import { Inject, Injectable, Optional } from '@angular/core';
import { GRID_FILTERS } from '../config/filters';
import { GridFilter } from '../components/filter/grid-filter';
import { gridReducer } from './data-grid';
import { FilterManagerService } from '../services/filter-manager.service';

@Injectable()
export class DataGridReducer {

  constructor(private filterManagerService: FilterManagerService) {

  }

  getRecucer() {
    return (state, action) => {
      return gridReducer(state, action, this.filterManagerService.filters);
    };
  }
}
