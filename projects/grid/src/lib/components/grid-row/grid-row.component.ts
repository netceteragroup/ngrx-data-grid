import { AfterViewInit, Component, ComponentFactory, ElementRef, Input, Output, QueryList, Renderer2, ViewChildren, EventEmitter } from '@angular/core';
import * as R from 'ramda';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';
import { GridCellComponent } from '@grid/components/grid-row/grid-cell/grid-cell.component';

@Component({
  selector: 'pcs-grid-row',
  templateUrl: 'grid-row.component.html'
})
export class GridRowComponent implements AfterViewInit {
  @Input() dataAndConfig: Array<DataAndConfig>;
  @Input() componentFactories: ComponentFactory<any>[];
  @Input() containerWidth: number;
  @Input() rowindex: number;
  @Input() selectedRows: number[];
  @Output() toggleRow = new EventEmitter;
  @ViewChildren(GridCellComponent, {read: ElementRef}) gridCellChildren: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    const initialCellWidth = this.containerWidth / this.dataAndConfig.length - 5;
    R.forEach((gridCell: ElementRef) => this.renderer.setStyle(gridCell.nativeElement, 'max-width', initialCellWidth + 'px'), this.gridCellChildren.toArray());
  }

  getComponent(config: ColumnConfig) {
    return R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === config.component.name, this.componentFactories);
  }

  toggleRowSelection(index: number) {
    this.toggleRow.emit(index);
  }

  get isSelected() {
    return R.contains(this.rowindex, this.selectedRows);
  }
}
