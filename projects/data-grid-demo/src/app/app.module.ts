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
import { BadgeComponent } from './components/badge/badge.component';
import { BadgeListComponent } from './components/badge/badge-list.component';
import { BadgesColumnComponent } from './components/badge/badges-column.component';
import { CustomFilterComponent } from './components/custom-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    NumberComponent,
    TextComponent,
    BadgeComponent,
    BadgeListComponent,
    BadgesColumnComponent,
    CustomFilterComponent
  ],
  entryComponents: [
    NumberComponent,
    TextComponent,
    BadgesColumnComponent,
    CustomFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    // StoreModule.forFeature('gridDemo', REDUCER_TOKEN),
    StoreDevtoolsModule.instrument({
      maxAge: 30
    }),
    NgRxDataGridModule.forRoot({
      stateKey: 'gridDemo'
    }, [CustomFilterComponent])
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
export class AppModule {
}
