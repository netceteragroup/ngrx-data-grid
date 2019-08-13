import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgRxDataGridModule } from 'ngrx-data-grid';
import { environment } from '@env/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MockService } from './mock/mock.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { NumberComponent } from './components/number.component';
import { TextComponent } from './components/text.component';

@NgModule({
  declarations: [
    AppComponent,
    NumberComponent,
    TextComponent
  ],
  entryComponents: [
    NumberComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 30,
      logOnly: environment.production
    }),
    NgRxDataGridModule.forRoot({stateKey: 'gridDemo'})
  ],
  providers: [MockService],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
