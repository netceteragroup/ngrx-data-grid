import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GridDisplayComponent } from './components/grid-display.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import { DynamicGridCellComponent } from './components/grid-row/grid-cell/dynamic-grid-cell.component';
import { ColumnSelectorComponent } from './components/column-selector/column-selector.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { DataGridComponent } from './containers/data-grid.component';
import { GridCellDirective } from './directives/grid-cell.directive';
import { GridHeaderItemComponent } from './components/grid-header/grid-header-item.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GridStoreConfig, InternalGridStoreConfig, NgrxGridConfig } from './config/grid-store-config';
import { DefaultGridCellComponent } from './components/grid-row/grid-cell/default-grid-cell.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { GridCellComponent } from './components/grid-row/grid-cell/grid-cell.component';
import { DynamicGridHeaderItemComponent } from './components/grid-header/dynamic-grid-header-item.component';
import { FilterOptionsService } from './services/filter-options/filter-options.service';
import { GridTranslateService } from './services/grid-translate.service';
import { GridDefaultTranslateService } from './services/grid-default-translate.service';
import { GridFilterDirective } from './components/filter/grid-filter.directive';
import { DynamicFilterComponent } from './components/filter/dynamic-filter.component';
import { NumberFilterComponent } from './components/filter/number-filter.component';
import { TextFilterComponent } from './components/filter/text-filter.component';
import { BooleanFilterComponent } from './components/filter/boolean-filter.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { RowSelectionComponent } from './components/row-selection/row-selection.component';
import { EmptyContentComponent } from './components/empty-content/empty-content.component';
import { RowSelectComponent } from './components/row-select/row-select.component';
import { DetailGridComponent } from './components/detail-grid/detail-grid.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColumnResizeDirective } from './directives/column-resize.directive';
import { ColumnResizeTriggerDirective } from './directives/column-resize-trigger.directive';

export const DEFAULT_GRID_FEATURE_NAME = 'grid';

export function createDefaultGridStoreConfig(config: NgrxGridConfig): NgrxGridConfig {
  return {
    stateKey: DEFAULT_GRID_FEATURE_NAME,
    ...config
  };
}

@NgModule({
  declarations: [
    GridDisplayComponent,
    DataGridComponent,
    GridCellDirective,
    GridRowComponent,
    DynamicGridCellComponent,
    GridCellComponent,
    ColumnSelectorComponent,
    PaginationComponent,
    GridHeaderComponent,
    GridHeaderItemComponent,
    DynamicGridHeaderItemComponent,
    GridFooterComponent,
    DefaultGridCellComponent,
    TranslatePipe,
    GridFilterDirective,
    DynamicFilterComponent,
    NumberFilterComponent,
    TextFilterComponent,
    BooleanFilterComponent,
    SelectComponent,
    ButtonComponent,
    RowSelectionComponent,
    EmptyContentComponent,
    RowSelectComponent,
    DetailGridComponent,
    ColumnResizeDirective,
    ColumnResizeTriggerDirective
  ],
  entryComponents: [
    DefaultGridCellComponent,
    NumberFilterComponent,
    TextFilterComponent,
    BooleanFilterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  exports: [
    DataGridComponent,
    ColumnSelectorComponent,
    GridDisplayComponent,
    SelectComponent,
    ButtonComponent
  ]
})
export class NgRxDataGridModule {
  static forRoot(config: NgrxGridConfig = {}): ModuleWithProviders<NgRxDataGridModule> {
    return {
      ngModule: NgRxDataGridModule,
      providers: [
        FilterOptionsService,
        {
          provide: GridTranslateService,
          useClass: GridDefaultTranslateService
        },
        {
          provide: InternalGridStoreConfig,
          useValue: config
        },
        {
          provide: GridStoreConfig,
          useFactory: createDefaultGridStoreConfig,
          deps: [InternalGridStoreConfig]
        }
      ]
    };
  }
}
