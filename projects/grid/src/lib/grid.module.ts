import { ModuleWithProviders, NgModule } from '@angular/core';
import { GridExampleModule } from '@example/grid-example.module';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { EntryComponentsConfig } from '@grid/config/entry-components-config';
import { GridDisplayComponent } from '@grid/components/grid-display.component';
import { GridComponent } from '@grid/containers/grid.component';
import { CellDirective } from '@grid/directives/cell.directive';
import { CellRowComponent } from '@grid/components/cell-row/cell-row.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@grid/store';

@NgModule({
  declarations: [
    GridDisplayComponent,
    GridComponent,
    CellDirective,
    CellRowComponent
  ],
  imports: [
    StoreModule.forRoot({
      grid: reducer
    }),
    GridExampleModule,
    CommonModule
  ],
  exports: [
    GridExampleModule,
    GridComponent,
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
