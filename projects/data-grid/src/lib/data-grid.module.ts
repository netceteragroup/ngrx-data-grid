import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridDisplayComponent } from './components/grid-display.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import { GridCellComponent } from './components/grid-row/grid-cell/grid-cell.component';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { reducer } from './store/index';
import { EntryComponentsService, FilterOptionsService } from './services';
import { EntryComponentsConfig } from './config';
import { DataGridComponent } from './containers/data-grid.component';
import { GridCellDirective } from './directives/grid-cell.directive';
import { GridHeaderItemComponent } from './components/grid-header/grid-header-item.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';

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
    GridFooterComponent
  ],
  imports: [
    StoreModule.forRoot({
      grid: reducer
    }),
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [FilterOptionsService],
  exports: [
    DataGridComponent,
    ColumnSelectorComponent,
    GridDisplayComponent
  ]
})
export class NgRxDataGridModule {
  static forRoot(config: EntryComponentsConfig): ModuleWithProviders {
    return {
      ngModule: NgRxDataGridModule,
      providers: [
        {
          provide: EntryComponentsService,
          useFactory() {
            return new EntryComponentsService(config);
          }
        }
      ]
    };
  }
}
