import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GridCellDirective } from '../../../directives/grid-cell.directive';
import { DataGridColumnWithId } from '../../../models';
import { DefaultGridCellComponent } from './default-grid-cell.component';

@Component({
  selector: 'ngrx-dynamic-grid-cell',
  templateUrl: 'dynamic-grid-cell.component.html',
  styleUrls: ['dynamic-grid-cell.component.scss']
})
export class DynamicGridCellComponent implements OnInit {
  @Input() row: any;
  @Input() data: any;
  @Input() column: DataGridColumnWithId;

  @ViewChild(GridCellDirective, {read: ViewContainerRef, static: true}) cellHost: ViewContainerRef;

  ngOnInit(): void {
    this.cellHost.clear();
    this.loadComponent();
  }

  private loadComponent(): void {
    const cellComponent = this.column.component || DefaultGridCellComponent;
    const componentRef = this.cellHost.createComponent(cellComponent);
    componentRef.instance.data = this.data;
    componentRef.instance.row = this.row;
  }
}
