import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PcsGridModule } from "@grid/grid.module";
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 30,
      logOnly: environment.production
    }),
    PcsGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
