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

  ngOnInit(): void {
    const config = this.dataAndConfig.config;

    this.cellHost.clear();

    const applyValueGetterAndFormatter: any = R.compose(
      this.propertyExists(config.valueFormatter),
      this.propertyExists(config.valueGetter)
    );

    this.loadComponent(applyValueGetterAndFormatter(this.dataAndConfig.data), this.componentFactory, config.componentInputName ? config.componentInputName : 'data');
  }

  private loadComponent(data: any, component: ComponentFactory<any>, prop: string): void {
    const templateRef = this.cellHost.createComponent(component);
    if (!R.isNil(prop)) {
      (templateRef.instance as any)[prop] = data;
    }
  }

  private propertyExists(func) {
    return func || R.identity;
  }
}
