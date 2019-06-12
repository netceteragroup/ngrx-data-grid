import { AfterViewInit, Component, ComponentFactory, ElementRef, Input, QueryList, Renderer2, ViewChildren } from '@angular/core';
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
}
