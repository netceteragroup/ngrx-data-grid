import { Component, ComponentFactory, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataAndConfig } from '@grid/config/column-config';
import { CellDirective } from '@grid/directives/cell.directive';
import { applyValueGetterAndFormatter } from '@grid/util/grid';

@Component({
  selector: 'pcs-grid-cell',
  templateUrl: 'grid-cell.component.html'
})
export class GridCellComponent implements OnInit {
  @Input() dataAndConfig: DataAndConfig;
  @Input() componentFactory: ComponentFactory<any>;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  ngOnInit(): void {
    this.cellHost.clear();
    this.loadComponent(applyValueGetterAndFormatter(this.dataAndConfig.config)(this.dataAndConfig.data), this.componentFactory);
  }

  private loadComponent(data: any, component: ComponentFactory<any>): void {
    const templateRef = this.cellHost.createComponent(component);
    (templateRef.instance as any).data = data;
  }
}
