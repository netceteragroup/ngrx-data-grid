import { Injector, ModuleWithProviders, NgModule, Inject, InjectionToken, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridDisplayComponent } from './components/grid-display.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import { DynamicGridCellComponent } from './components/grid-row/grid-cell/dynamic-grid-cell.component';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { DataGridComponent } from './containers/data-grid.component';
import { GridCellDirective } from './directives/grid-cell.directive';
import { GridHeaderItemComponent } from './components/grid-header/grid-header-item.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GridStoreConfig, InternalGridStoreConfig, NgrxGridConfig } from './config/grid-store-config';
import { DefaultGridCellComponent } from './components/grid-row/grid-cell/default-grid-cell.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { GridCellComponent } from './components/grid-row/grid-cell/grid-cell.component';
import { DynamicGridHeaderItemComponent } from './components/grid-header/dynamic-grid-header-item.component';
import { FilterOptionsService } from './services/filter-options/filter-options.service';
import { GridTranslateService } from './services/grid-translate.service';
import { GridDefaultTranslateService } from './services/grid-default-translate.service';
import { GRID_FILTERS, INTERNAL_GRID_FILTERS } from './config/filters';
import { DataGridReducer } from './store/data-grid-reducer';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { FilterManagerService } from './services/filter-manager.service';

export const DEFAULT_GRID_FEATURE_NAME = 'grid';

export function createDefaultGridStoreConfig(config: NgrxGridConfig): NgrxGridConfig {
  return {
    stateKey: DEFAULT_GRID_FEATURE_NAME,
    ...config
  };
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducer<any>>('State reducer');

export function reducerFactory(gridReducerService: DataGridReducer) {
  return gridReducerService.getRecucer();
}


export function createFiltersFactory(filters) {
  const initial = [];
  return [...initial, ...filters];
}

export function createChildFiltersFactory(oldFilters, newFilters) {
  return [...oldFilters, ...newFilters];
}

@NgModule({
  declarations: [
    GridDisplayComponent,
    DataGridComponent,
    GridCellDirective,
    GridRowComponent,
    DynamicGridCellComponent,
    GridCellComponent,
    ColumnSelectorComponent,
    PaginationComponent,
    FilterComponent,
    GridHeaderComponent,
    GridHeaderItemComponent,
    DynamicGridHeaderItemComponent,
    GridFooterComponent,
    DefaultGridCellComponent,
    TranslatePipe
  ],
  entryComponents: [
    DefaultGridCellComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    StoreModule.forFeature('gridDemo', REDUCER_TOKEN)
  ],
  exports: [
    DataGridComponent,
    ColumnSelectorComponent,
    GridDisplayComponent
  ]
})
export class NgRxDataGridRootModule {
  constructor(@Inject(GRID_FILTERS) private gridFilters: any[], private filterManagerService: FilterManagerService) {
    filterManagerService.addFilters(gridFilters);
  }
}

@NgModule({})
export class NgRxDataGridChildModule implements OnDestroy {
  constructor(@Inject(GRID_FILTERS) private gridFilters: any[], private filterManagerService: FilterManagerService) {
    filterManagerService.addFilters(gridFilters);
  }

  ngOnDestroy() {
    this.filterManagerService.remove(this.gridFilters);
  }

}

@NgModule({})
export class NgRxDataGridModule {
  static forRoot(config: NgrxGridConfig = {}, filters?: any[]): ModuleWithProviders {
    return {
      ngModule: NgRxDataGridRootModule,
      providers: [
        FilterOptionsService,
        FilterManagerService,
        {
          provide: GridTranslateService,
          useClass: GridDefaultTranslateService
        },
        {
          provide: InternalGridStoreConfig,
          useValue: config
        },
        {
          provide: GridStoreConfig,
          useFactory: createDefaultGridStoreConfig,
          deps: [InternalGridStoreConfig]
        },
        {
          provide: INTERNAL_GRID_FILTERS,
          useValue: filters,
          multi: true
        },
        {
          provide: GRID_FILTERS,
          useFactory: createFiltersFactory,
          multi: true,
          deps: [
            INTERNAL_GRID_FILTERS
          ]
        },
        DataGridReducer,
        {
          provide: REDUCER_TOKEN,
          deps: [DataGridReducer],
          useFactory: reducerFactory
        }
      ]
    };
  }

  static forChild(filters?: any[]): ModuleWithProviders {
    return {
      ngModule: NgRxDataGridChildModule,
      providers: [
        {
          provide: GRID_FILTERS,
          useValue: filters,
          multi: true
        }
      ]
    };
  }
}
