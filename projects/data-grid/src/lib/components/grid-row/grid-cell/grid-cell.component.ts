import { Component, ComponentFactory, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { DataAndConfig } from '../../../config';
import { applyValueGetterAndFormatter } from '../../../util/grid';
import { GridCellDirective } from '../../../directives/grid-cell.directive';

@Component({
  selector: 'ngrx-grid-cell',
  templateUrl: 'grid-cell.component.html',
  styleUrls: ['grid-cell.component.scss']
})
export class GridCellComponent implements OnInit {
  @Input() dataAndConfig: DataAndConfig;
  @Input() componentFactory: ComponentFactory<any>;
  @ViewChild(GridCellDirective, {read: ViewContainerRef, static: true}) cellHost: ViewContainerRef;

  ngOnInit(): void {
    const config = this.dataAndConfig.config;

    this.cellHost.clear();

    this.loadComponent(applyValueGetterAndFormatter(config)(this.dataAndConfig.dataItem), this.componentFactory, config.componentInputName ? config.componentInputName : 'data');
  }

  private loadComponent(data: any, component: ComponentFactory<any>, prop: string): void {
    const templateRef = this.cellHost.createComponent(component);
    if (!R.isNil(prop)) {
      (templateRef.instance as any)[prop] = data;
    }
  }
}
