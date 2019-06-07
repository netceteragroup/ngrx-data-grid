import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from '@example/reducers';
import { CommonModule } from '@angular/common';
import { DisplayGridExampleComponent } from '@example/components/display-grid-example.component';
import { GridExampleComponent } from '@example/containers/grid-example.component';

@NgModule({
  imports: [
    StoreModule.forRoot({
      gridExample: reducer
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
