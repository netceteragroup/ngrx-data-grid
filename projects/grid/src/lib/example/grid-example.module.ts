import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@grid/store';
import { CommonModule } from '@angular/common';
import { DisplayGridExampleComponent } from '@example/components/display-grid-example.component';
import { GridExampleComponent } from '@example/containers/grid-example.component';

@NgModule({
  imports: [
    StoreModule.forRoot({
      grid: reducer
    }),
    CommonModule
  ],
  declarations: [
    DisplayGridExampleComponent,
    GridExampleComponent
  ],
  exports: [
    DisplayGridExampleComponent,
    GridExampleComponent
  ]
})
export class GridExampleModule { }
