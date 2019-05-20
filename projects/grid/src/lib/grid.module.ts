import { NgModule } from '@angular/core';
import { GridExampleModule } from '@example/grid-example.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    GridExampleModule,
    StoreDevtoolsModule.instrument({
      maxAge: 30
    })
  ],
  exports: [
    GridExampleModule
  ]
})
export class PcsGridModule {

}
