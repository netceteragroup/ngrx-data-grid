import { NgModule } from '@angular/core';
import { NgRxDataGridModule } from 'ngrx-data-grid';
import { SubFeatureRoutingModule } from './sub-feature-routing.module';
import { SubFeatureComponent } from './sub-feature.component';
import { CustomFilter1Component } from '../components/custom-filter1.component';

@NgModule({
  imports: [
    NgRxDataGridModule.forChild([CustomFilter1Component]),
    SubFeatureRoutingModule
  ],
  declarations: [
    SubFeatureComponent,
    CustomFilter1Component
  ],
  exports: []
})
export class SubFeatureModule {
}
