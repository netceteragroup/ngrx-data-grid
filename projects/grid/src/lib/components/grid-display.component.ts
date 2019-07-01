import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, NgModule, Output } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridConfig, PaginationConfig } from '@grid/config/grid-config';

const getArrowClass = R.cond([[R.equals('ASC'), R.always('arrow-up')], [R.equals('DESC'), R.always('arrow-down')], [R.T, R.always('')]]);

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
  @Input() numberOfRows: number;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortGrid = new EventEmitter();
  @Output() toggleColumnVisibility: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleRow = new EventEmitter();
  @Output() toggleSelectAllRows = new EventEmitter();
  componentFactories: ComponentFactory<any>[];

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    const isVisible = (item) => item.config.isVisible;
    return R.map(dataItem => R.reject(R.complement(isVisible), R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.columnConfig)), this.pagedData);
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

  onToggleRow(index: number) {
    const id = R.prop('gridRowId', this.pagedData[index]);
    this.toggleRow.emit(id);
  }

  onToggleSelectAllRows() {
    this.toggleSelectAllRows.emit();
  }

  get allRowsSelected() {
    return R.equals(this.config.selectedRowsIds.length, this.numberOfRows);
  }

  getArrow(columnConfigId: number) {
    return getArrowClass(this.columnConfig[columnConfigId].sortType);
  }

  headerClass(index: number) {
    return 'text-white col ' + this.getArrow(index);
  }

  checkSelected(index: number) {
    const id = R.prop('gridRowId', this.pagedData[index]);
    return R.contains(id, this.config.selectedRowsIds);
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
