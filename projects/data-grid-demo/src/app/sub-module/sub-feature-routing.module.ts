import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubFeatureComponent } from './sub-feature.component';

const routes: Routes = [
  {
    path: '',
    component: SubFeatureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubFeatureRoutingModule { }
