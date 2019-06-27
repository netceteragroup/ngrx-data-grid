import { ModuleWithProviders, NgModule } from '@angular/core';
import { GridExampleModule } from '@example/grid-example.module';
import { EntryComponentsService } from '@grid/services/entry-components/entry-components.service';
import { EntryComponentsConfig } from '@grid/config/entry-components-config';
import { GridDisplayComponent } from '@grid/components/grid-display.component';
import { GridComponent } from '@grid/containers/grid.component';
import { CellDirective } from '@grid/directives/cell.directive';
import { GridRowComponent } from '@grid/components/grid-row/grid-row.component';
import { CommonModule } from '@angular/common';
import { GridCellComponent } from '@grid/components/grid-row/grid-cell/grid-cell.component';
import { ColumnSelectorComponent } from '@grid/components/column-selector/column-selector.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@grid/store';
import { PaginationComponent } from '@grid/components/pagination/pagination.component';
import { FilterComponent } from '@grid/components/filter/filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterOptionsService } from '@grid/services/filter-options/filter-options.service';
import { GridHeaderComponent } from '@grid/components/grid-header/grid-header.component';

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
    GridExampleModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [FilterOptionsService],
  exports: [
    GridExampleModule,
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
