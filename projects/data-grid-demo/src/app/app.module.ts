import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridTranslateService, NgRxDataGridModule } from 'ngrx-data-grid';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MockService } from './mock/mock.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { NumberComponent } from './components/number.component';
import { TextComponent } from './components/text.component';
import { AppTranslateService } from './services/app-translate.service';
import { TrafficLightComponent } from './components/traffic-lights/traffic-light.component';
import { TrafficLightsListColumnComponent } from './components/traffic-lights/traffic-lights-list-column.component';
import { TrafficLightsColumnComponent } from './components/traffic-lights/traffic-lights-column.component';

@NgModule({
  declarations: [
    AppComponent,
    NumberComponent,
    TextComponent,
    TrafficLightComponent,
    TrafficLightsListColumnComponent,
    TrafficLightsColumnComponent
  ],
  entryComponents: [
    NumberComponent,
    TextComponent,
    TrafficLightsColumnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 30
    }),
    NgRxDataGridModule.forRoot({stateKey: 'gridDemo'})
  ],
  providers: [
    MockService,
    AppTranslateService,
    {
      provide: GridTranslateService,
      useExisting: AppTranslateService
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
