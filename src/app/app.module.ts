import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PcsGridModule } from '@grid/grid.module';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { PriceComponent } from './components/price.component';
import { TextComponent } from './components/text.component';

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
    PcsGridModule.forRoot({entryComponents: [PriceComponent, TextComponent]})
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
