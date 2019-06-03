import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@grid/store';
import { CommonModule } from '@angular/common';
import { DisplayGridExampleComponent } from '@example/components/display-grid-example.component';
import { GridExampleComponent } from '@example/containers/grid-example.component';
import { GridComponent } from '@grid/components/grid.component';
import { CellRowComponent } from '@grid/components/CellRowComponent/cell-row.component';
import { CellDirective } from '@grid/directives/cell.directive';


@NgModule({
  imports: [
    StoreModule.forRoot({
      grid: reducer
    }),
    CommonModule
  ],
  declarations: [
    DisplayGridExampleComponent,
    GridExampleComponent,
    GridComponent,
    CellRowComponent,
    CellDirective
  ],
  entryComponents: [
    CellRowComponent
  ],
  exports: [
    DisplayGridExampleComponent,
    GridExampleComponent,
    GridComponent
  ]
})
export class GridExampleModule {

}
