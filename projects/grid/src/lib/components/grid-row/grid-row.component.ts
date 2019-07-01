<<<<<<< HEAD
import { AfterViewInit, Component, ComponentFactory, ElementRef, Input, Output, QueryList, Renderer2, ViewChildren, EventEmitter } from '@angular/core';
=======
import { Component, ComponentFactory, Input } from '@angular/core';
>>>>>>> c56a5070d213a5bc0d1cbd5d47c209f48a43c5dd
import * as R from 'ramda';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';

@Component({
  selector: 'pcs-grid-row',
  templateUrl: 'grid-row.component.html'
})
export class GridRowComponent {
  @Input() dataAndConfig: Array<DataAndConfig>;
  @Input() componentFactories: ComponentFactory<any>[];
<<<<<<< HEAD
  @Input() containerWidth: number;
  @Input() isSelected: boolean;
  @Output() toggleRow = new EventEmitter;
  @ViewChildren(GridCellComponent, {read: ElementRef}) gridCellChildren: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    const initialCellWidth = this.containerWidth / this.dataAndConfig.length - 5;
    R.forEach((gridCell: ElementRef) => this.renderer.setStyle(gridCell.nativeElement, 'max-width', initialCellWidth + 'px'), this.gridCellChildren.toArray());
  }
=======
>>>>>>> c56a5070d213a5bc0d1cbd5d47c209f48a43c5dd

  getComponent(config: ColumnConfig) {
    return R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === config.component.name, this.componentFactories);
  }

  toggleRowSelection() {
    this.toggleRow.emit();
  }

}
