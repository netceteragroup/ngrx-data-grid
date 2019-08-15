import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { GridCellDirective } from '../../../directives/grid-cell.directive';
import { DataGridColumnWithId, GridCell } from '../../../models';
import { DefaultGridCellComponent } from './default-grid-cell.component';

@Component({
  selector: 'ngrx-grid-cell',
  templateUrl: 'grid-cell.component.html',
  styleUrls: ['grid-cell.component.scss']
})
export class GridCellComponent implements OnInit {
  @Input() data: any;
  @Input() column: DataGridColumnWithId;

  @ViewChild(GridCellDirective, {read: ViewContainerRef, static: true}) cellHost: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.cellHost.clear();
    this.loadComponent();
  }

  private loadComponent(): void {
    const cellComponent = this.column.component || DefaultGridCellComponent;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<GridCell>(cellComponent);
    const componentRef = this.cellHost.createComponent(componentFactory);
    componentRef.instance.data = this.data;
  }
}
