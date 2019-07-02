import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, NgModule, Output } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { PaginationConfig } from '@grid/config/grid-config';

const getArrowClass = R.cond([[R.equals('ASC'), R.always('arrow-up')], [R.equals('DESC'), R.always('arrow-down')], [R.T, R.always('')]]);
const isVisible = (item) => item.config.isVisible;
const rejectInvisibleConfigs = R.reject(R.complement(isVisible));

@Component({
  selector: 'pcs-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() paginationConfig: PaginationConfig;
  @Input() pagedData: Array<object>;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortGrid = new EventEmitter();
  @Output() toggleColumnVisibility: EventEmitter<number> = new EventEmitter<number>();
  @Output() filterGrid: EventEmitter<ColumnConfig> = new EventEmitter<ColumnConfig>();
  componentFactories: ComponentFactory<any>[];

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    const setConfigs = dataItem => rejectInvisibleConfigs(R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig));
    return R.map(setConfigs, this.pagedData);
  }

  get headers() {
    return R.map(configItem => configItem.headerName, this.columnConfig);
  }

  get gridColumns() {
    const activeColumns = R.filter((config: ColumnConfig) => config.isVisible, this.columnConfig).length;
    return {'grid-template-columns': `repeat(${activeColumns}, minmax(50px, 1.4fr))`};
  }

  get displayContentsStyle() {
    return {'display': 'contents'};
  }

  sendNewPageSize(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }

  sendNewPageNum(pageNum: number) {
    this.pageNumChange.emit(pageNum);
  }

  onSortGrid(columnConfig: ColumnConfig) {
    this.sortGrid.emit(columnConfig);
  }

  onToggleColumn(index: number) {
    this.toggleColumnVisibility.emit(index);
  }

  getArrow(columnConfigId: number) {
    return getArrowClass(this.columnConfig[columnConfigId].sortType);
  }

  changeFilterInConfig(columnConfig: ColumnConfig) {
    this.filterGrid.emit(columnConfig);
  }

  headerClass(index: number) {
    return 'text-white col ' + this.getArrow(index);
  }

  private createComponentFactories(components: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: components,
      entryComponents: components
    })
    class EntryComponentsModule {
    }

    return this.compiler.compileModuleAndAllComponentsSync(EntryComponentsModule).componentFactories;
  }

}
