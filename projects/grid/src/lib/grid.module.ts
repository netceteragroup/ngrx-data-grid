import { ModuleWithProviders, NgModule } from '@angular/core';
import { GridExampleModule } from '@example/grid-example.module';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { EntryComponentsConfig } from '@grid/config/entry-components-config';
import { GridComponent } from '@grid/components/grid.component';
import { CellDirective } from '@grid/directives/cell.directive';
import { CellRowComponent } from '@grid/components/cell-row/cell-row.component';
import { CommonModule } from '@angular/common';

// @dynamic
@NgModule({
  declarations: [
    GridComponent,
    CellDirective,
    CellRowComponent
  ],
  imports: [
    GridExampleModule,
    CommonModule
  ],
  exports: [
    GridExampleModule,
    GridComponent
  ]
})
export class PcsGridModule {
  static forRoot(config: EntryComponentsConfig): ModuleWithProviders {
    return {
      ngModule: PcsGridModule,
      providers: [
        {provide: EntryComponentsService, useFactory: () => new EntryComponentsService(config)}
      ]
    };
  }
}
