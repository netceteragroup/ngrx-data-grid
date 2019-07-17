import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridDisplayComponent } from './components/grid-display.component';
import { GridComponent } from './containers/grid.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import { GridCellComponent } from './components/grid-row/grid-cell/grid-cell.component';
import { CellDirective } from './directives/cell.directive';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { reducer } from './store/index';
import { EntryComponentsService, FilterOptionsService } from './services';
import { EntryComponentsConfig } from './config';

@NgModule({
  declarations: [
    GridDisplayComponent,
    GridComponent,
    CellDirective,
    GridRowComponent,
    GridCellComponent,
    ColumnSelectorComponent,
    PaginationComponent,
    FilterComponent,
    GridHeaderComponent
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
    GridComponent,
    ColumnSelectorComponent,
    GridDisplayComponent
  ]
})
export class PcsGridModule {
  static forRoot(config: EntryComponentsConfig): ModuleWithProviders {
    return {
      ngModule: PcsGridModule,
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
