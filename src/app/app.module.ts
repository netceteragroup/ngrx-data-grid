import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PcsGridModule } from "projects/grid/src/lib/grid.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PcsGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
