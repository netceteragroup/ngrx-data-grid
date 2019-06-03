import { ModuleWithProviders, NgModule } from '@angular/core';
import { GridExampleModule } from '@example/grid-example.module';
import { EntryComponentsConfig } from '@grid/services/entry-components.service';

@NgModule({
  imports: [
    GridExampleModule,
  ],
  exports: [
    GridExampleModule
  ]
})
export class PcsGridModule {
  constructor() { }

  static forRoot(config: EntryComponentsConfig): ModuleWithProviders {
    return {
      ngModule: PcsGridModule,
      providers: [
        {provide: EntryComponentsConfig, useValue: config}
      ]
    };
  }

}
