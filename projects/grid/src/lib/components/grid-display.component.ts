import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, NgModule, Output } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig } from '@grid/config/grid-config';

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
  @Input() config: GridConfig;
  @Input() paginationConfig: PaginationConfig;
  @Input() pagedData: Array<object>;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortGrid = new EventEmitter();
  @Output() toggleColumnVisibility: EventEmitter<number> = new EventEmitter<number>();
  componentFactories: ComponentFactory<any>[];

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    const setConfigs = dataItem => rejectInvisibleConfigs( R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig));
    return R.map(setConfigs, this.pagedData);
  }

  get headers() {
    return R.map(configItem => configItem.headerName, this.columnConfig);
  }

  sendNewPageSize(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }

  sendNewPageNum(pageNum: number) {
    this.pageNumChange.emit(pageNum);
  }

  onSortGrid(columnConfigId: number) {
    const item = this.columnConfig[columnConfigId];
    if (item.sortable) {
      this.sortGrid.emit(R.assoc('sortType', R.isNil(item.sortType) ? 'DESC' : item.sortType === 'ASC' ? null : 'ASC', item));
    }
  }

  onToggleColumn(index: number) {
    this.toggleColumnVisibility.emit(index);
  }

  getArrow(columnConfigId: number) {
    return getArrowClass(this.columnConfig[columnConfigId].sortType);
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
