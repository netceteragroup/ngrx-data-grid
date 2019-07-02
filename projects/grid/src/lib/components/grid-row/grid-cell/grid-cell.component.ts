import { Component, ComponentFactory, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataAndConfig } from '@grid/config/column-config';
import { CellDirective } from '@grid/directives/cell.directive';
import { applyValueGetterAndFormatter } from '@grid/util/grid';
import * as R from 'ramda';

@Component({
  selector: 'pcs-grid-cell',
  templateUrl: 'grid-cell.component.html'
})
export class GridCellComponent implements OnInit {
  @Input() styleInput: string;
  @Input() dataAndConfig: DataAndConfig;
  @Input() componentFactory: ComponentFactory<any>;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  ngOnInit(): void {
    const config = this.dataAndConfig.config;

    this.cellHost.clear();

    this.loadComponent(applyValueGetterAndFormatter(this.dataAndConfig.data), this.componentFactory, config.componentInputName ? config.componentInputName : 'data');
  }

  private loadComponent(data: any, component: ComponentFactory<any>, prop: string): void {
    const templateRef = this.cellHost.createComponent(component);
    if (!R.isNil(prop)) {
      (templateRef.instance as any)[prop] = data;
    }
  }
}
