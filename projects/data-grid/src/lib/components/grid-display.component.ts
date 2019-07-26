import { ChangeDetectionStrategy, Compiler, Component, ComponentFactory, EventEmitter, Input, NgModule, Output } from '@angular/core';
import * as R from 'ramda';
import { SelectionConfig } from '../config';
import { EntryComponentsService } from '../services';
import { DataGridColumnWithId } from '../models';
import { getNumberOfVisibleColumns } from '../util/grid-columns';

@Component({
  selector: 'ngrx-grid-display',
  templateUrl: 'grid-display.component.html',
  styleUrls: ['grid-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridDisplayComponent {
  @Input() selectionConfig: SelectionConfig;
  @Input() columns: DataGridColumnWithId[] = [];
  @Input() gridRows: any[] = [];
  @Input() rowDataIndexes: number[] = [];
  @Input() selectedRowIndexes: number[] = [];

  @Output() toggleRow = new EventEmitter();

  componentFactories: ComponentFactory<any>[];

  constructor(private entryService: EntryComponentsService, private compiler: Compiler) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  get gridColumns() {
    const selection = (this.selectionConfig.checkboxSelection) ? '3rem ' : '';
    const activeColumns = getNumberOfVisibleColumns(this.columns);
    return {'grid-template-columns': `${selection}repeat(${activeColumns}, minmax(50px, 1.4fr))`};
  }

  trackByIndex(_, index) {
    return index;
  }

  onToggleRow(index: number) {
    this.toggleRow.emit(this.gridRows[index]);
  }

  checkSelected(index: number): boolean {
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
