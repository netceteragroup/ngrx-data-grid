import { Component, ComponentFactory, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GridCellDirective } from '../../../directives/grid-cell.directive';

@Component({
  selector: 'ngrx-grid-cell',
  templateUrl: 'grid-cell.component.html',
  styleUrls: ['grid-cell.component.scss']
})
export class GridCellComponent implements OnInit {
  @Input() data: any;
  @Input() componentFactory: ComponentFactory<any>;
  @ViewChild(GridCellDirective, {read: ViewContainerRef, static: true}) cellHost: ViewContainerRef;

  ngOnInit(): void {
    this.cellHost.clear();
    this.loadComponent();
  }

  private loadComponent(): void {
    const templateRef = this.cellHost.createComponent(this.componentFactory);

    // TODO HD we will remove this when we create an interface for the cell components.
    const componentPropName = 'data';
    templateRef.instance[componentPropName] = this.data;
  }
}
