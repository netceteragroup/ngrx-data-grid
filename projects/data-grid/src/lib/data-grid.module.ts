import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridDisplayComponent } from './components/grid-display.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import { GridCellComponent } from './components/grid-row/grid-cell/grid-cell.component';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { FilterOptionsService, GridDefaultTranslateService, GridTranslateService } from './services';
import { DataGridComponent } from './containers/data-grid.component';
import { GridCellDirective } from './directives/grid-cell.directive';
import { GridHeaderItemComponent } from './components/grid-header/grid-header-item.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GridStoreConfig, InternalGridStoreConfig, NgrxGridConfig } from './config';
import { DefaultGridCellComponent } from './components/grid-row/grid-cell/default-grid-cell.component';
import { TranslatePipe } from './pipes/translate.pipe';

export const DEFAULT_GRID_FEATURE_NAME = 'grid';

export function createDefaultGridStoreConfig(config: NgrxGridConfig): NgrxGridConfig {
  return {
    stateKey: DEFAULT_GRID_FEATURE_NAME,
    ...config
  };
}

@NgModule({
  declarations: [
    GridDisplayComponent,
    DataGridComponent,
    GridCellDirective,
    GridRowComponent,
    GridCellComponent,
    ColumnSelectorComponent,
    PaginationComponent,
    FilterComponent,
    GridHeaderComponent,
    GridHeaderItemComponent,
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
    ReactiveFormsModule
  ],
  providers: [
    FilterOptionsService,
    {
      provide: GridTranslateService,
      useClass: GridDefaultTranslateService
    },
    {
      provide: GridStoreConfig,
      useFactory: createDefaultGridStoreConfig,
      deps: [InternalGridStoreConfig]
    }
  ],
  exports: [
    DataGridComponent,
    ColumnSelectorComponent,
    GridDisplayComponent
  ]
})
export class NgRxDataGridModule {
  static forRoot(config: NgrxGridConfig = {}): ModuleWithProviders {
    return {
      ngModule: NgRxDataGridModule,
      providers: [
        {
          provide: InternalGridStoreConfig,
          useValue: config
        }
      ]
    };
  }
}
