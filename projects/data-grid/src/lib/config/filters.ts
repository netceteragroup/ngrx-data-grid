import { InjectionToken } from '@angular/core';
import { GridFilter } from '../components/filter/grid-filter';

export const GRID_FILTERS = new InjectionToken<GridFilter[]>('ngrx-data-grid/grid-filters');

export const GRID_FILTERS_TOKEN = new InjectionToken<GridFilter[]>('ngrx-data-grid/grid-filters-token');

export const INTERNAL_GRID_FILTERS = new InjectionToken<GridFilter[]>('ngrx-data-grid/internal-grid-filters');
