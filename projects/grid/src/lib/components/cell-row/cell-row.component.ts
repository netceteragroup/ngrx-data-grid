import { Component, ComponentFactory, ComponentRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import * as R from 'ramda';
import { CellDirective } from '@grid/directives/cell.directive';
import { DataAndConfig } from '@grid/config/column-config';

@Component({
  selector: 'pcs-cell-row',
  templateUrl: 'cell-row.component.html'
})
export class CellRowComponent implements OnInit {
  @Input() dataAndConfig: Array<DataAndConfig>;
  @Input() componentFactories: ComponentFactory<any>[];
  @Input() containerWidth: number;
  @ViewChild(CellDirective, {read: ViewContainerRef}) cellHost: ViewContainerRef;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.cellHost.clear();
    R.map((dataItem: DataAndConfig) => {
      const applyValueGetter: Function = dataItem.config.valueGetter;
      const applyValueFormatter: Function = dataItem.config.valueFormatter;

      const applyValueGetterAndFormatter: any = R.compose(
        this.propertyExists(applyValueFormatter),
        this.propertyExists(applyValueGetter)
      );
      this.loadComponent(applyValueGetterAndFormatter(dataItem.data), dataItem.config.component);
    }, this.dataAndConfig);
  }

  private loadComponent(data: any, component: any) {
    const foundComponent = R.find((cmp: ComponentFactory<any>) => cmp.componentType.name === component.name, this.componentFactories);
    const templateRef = this.cellHost.createComponent(foundComponent);
    (templateRef.instance as any).data = data;

    this.renderer.setStyle(templateRef.location.nativeElement, 'width', (this.containerWidth / this.dataAndConfig.length - 5) + 'px');
    this.setStylesAndClasses(templateRef);
  }

  private setStylesAndClasses(componentRef: ComponentRef<any>) {
    this.renderer.addClass(componentRef.location.nativeElement.querySelector('div').querySelector('p'), 'text-center');
    this.renderer.addClass(componentRef.location.nativeElement.querySelector('div').querySelector('p'), 'overflow-hidden');
    this.renderer.addClass(componentRef.location.nativeElement.querySelector('div').querySelector('p'), 'text-nowrap');
    this.renderer.setStyle(componentRef.location.nativeElement, 'padding-left', '1%');
    this.renderer.setStyle(componentRef.location.nativeElement, 'padding-right', '1%');
  }

  private propertyExists(func) {
    return func || R.identity;
  }
}
