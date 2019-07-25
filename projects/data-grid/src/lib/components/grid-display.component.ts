import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, NgModule, Output } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig, DataAndConfig, PaginationConfig, SelectionConfig } from '../config';
import { EntryComponentsService } from '../services';
import { DataGridColumn, GridDataFilterWithColumnId, GridDataSortWithColumnId } from '../models';

const isVisible = (item) => item.config.isVisible;
const rejectInvisibleConfigs = R.reject(R.complement(isVisible));

@Component({
  selector: 'ngrx-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() columnConfig: Array<ColumnConfig>;
  @Input() paginationConfig: PaginationConfig;
  @Input() selectionConfig: SelectionConfig;

  @Input() columns: DataGridColumn[] = [];

  @Input() pagedData: any[] = [];
  @Input() rowDataIndexes: number[] = [];
  @Input() selectedRowIndexes: number[] = [];

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() toggleColumnVisibility: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleRow = new EventEmitter();
  @Output() toggleSelectAllRows = new EventEmitter();

  @Output() sortGrid: EventEmitter<GridDataSortWithColumnId> = new EventEmitter<GridDataSortWithColumnId>();
  @Output() filterGrid: EventEmitter<GridDataFilterWithColumnId> = new EventEmitter<GridDataFilterWithColumnId>();

  componentFactories: ComponentFactory<any>[];

  allRowsSelected: boolean;

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  get dataAndConfig(): Array<Array<DataAndConfig>> {
    const setConfigs = dataItem => rejectInvisibleConfigs(R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field],
      dataItem: dataItem
    }), this.columnConfig));
    return R.map(setConfigs, this.pagedData);
  }

  get gridColumns() {
    const selection = (this.selectionConfig.checkboxSelection) ? '3rem ' : '';
    const activeColumns = R.filter((config: ColumnConfig) => config.isVisible, this.columnConfig).length;
    return {'grid-template-columns': `${selection}repeat(${activeColumns}, minmax(50px, 1.4fr))`};
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

  onSortGrid(sort: GridDataSortWithColumnId) {
    this.sortGrid.emit(sort);
  }

  onToggleColumn(columnId: string) {
    this.toggleColumnVisibility.emit(columnId);
  }

  onToggleRow(index: number) {
    this.toggleRow.emit(this.pagedData[index]);
  }

  onToggleSelectAllRows() {
    this.allRowsSelected = !this.allRowsSelected;
    this.toggleSelectAllRows.emit(this.allRowsSelected);
  }

  onFilterGrid(filter: GridDataFilterWithColumnId) {
    this.filterGrid.emit(filter);
  }

  checkSelected(index: number): boolean {
    this.allRowsSelected = this.selectedRowIndexes.length === this.pagedData.length;

    const selectedRowIndex = this.rowDataIndexes[index];
    return R.contains(selectedRowIndex, this.selectedRowIndexes);
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
