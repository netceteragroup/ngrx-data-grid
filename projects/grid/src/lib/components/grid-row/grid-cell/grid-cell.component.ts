import { Component, ComponentFactory, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { DataAndConfig } from '@grid/config/column-config';
import { CellDirective } from '@grid/directives/cell.directive';

@Component({
  selector: 'pcs-grid-cell',
  templateUrl: 'grid-cell.component.html'
})
export class GridCellComponent implements OnInit {
  @Input() dataAndConfig: DataAndConfig;
  @Input() componentFactory: ComponentFactory<any>;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  constructor() {
  }

  ngOnInit(): void {
    this.cellHost.clear();

    const applyValueGetterAndFormatter: any = R.compose(
      this.propertyExists(this.dataAndConfig.config.valueFormatter),
      this.propertyExists(this.dataAndConfig.config.valueGetter)
    );

    this.loadComponent(applyValueGetterAndFormatter(this.dataAndConfig.data), this.componentFactory);
  }

  private loadComponent(data: any, component: ComponentFactory<any>): void {
    const templateRef = this.cellHost.createComponent(component);
    (templateRef.instance as any).data = data;
  }

  private propertyExists(func) {
    return func || R.identity;
  }
}
