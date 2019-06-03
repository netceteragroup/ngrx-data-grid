import { Component, ComponentFactoryResolver, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { CellDirective } from '@grid/directives/cell.directive';
import { DataAndConfig } from '@grid/config/Config';

@Component({
  selector: 'pcs-cell-row',
  templateUrl: 'cell-row.component.html'
})
export class CellRowComponent implements OnInit {
  @Input() dataAndConfig: Array<DataAndConfig>;
  @Input() componentFactories: object;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.cellHost.clear();
    R.map((dataItem: DataAndConfig) => {
      const applyValueGetter: Function = dataItem.config.valueGetter;
      const applyValueFormatter: Function = dataItem.config.valueFormatter;

      const composedFn: any = R.compose(
        this.propertyExists(applyValueFormatter),
        this.propertyExists(applyValueGetter)
      );
      this.loadComponent(composedFn(dataItem.data), dataItem.config.component);
    }, this.dataAndConfig);
  }

  loadComponent(data: any, component: any) {
    const templateRef = this.cellHost.createComponent(this.componentFactories[component.name]);
    (templateRef.instance as any).data = data;

    this.renderer.addClass(templateRef.location.nativeElement, 'col');
  }

  private propertyExists(func) {
    return function returnIdentityOrFunction(data: any) {
      if (typeof func === undefined || typeof func === 'undefined' || func === null) {
        return R.identity(data);
      } else {
        return func(data);
      }
    };
  }
}
