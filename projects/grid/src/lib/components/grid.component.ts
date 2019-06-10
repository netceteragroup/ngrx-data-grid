import { AfterViewInit, Compiler, Component, ComponentFactory, ElementRef, Input, NgModule, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import * as R from 'ramda';
import { EntryComponentsService } from '@grid/services/entry-components.service';
import { ColumnConfig, DataAndConfig } from '@grid/config/column-config';

@Component({
  selector: 'pcs-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() data: Array<any>;
  @Input() config: Array<ColumnConfig>;
  @ViewChildren('headerRef') headerRefs: QueryList<any>;
  @ViewChild('containerRef') container: ElementRef;

  componentFactories: ComponentFactory<any>[];
  dataAndConfig: Array<Array<DataAndConfig>>;
  headers: Array<string>;

  constructor(private entryService: EntryComponentsService, private compiler: Compiler, private renderer: Renderer2) {
    this.componentFactories = this.createComponentFactories(this.entryService.entryComponentsArray);
  }

  ngOnInit(): void {
    this.dataAndConfig = R.map(dataItem => R.map(configItem => ({
      config: configItem,
      data: dataItem[configItem.field]
    }), this.config), this.data);
    this.headers = R.map(configItem => configItem.headerName, this.config);
  }

  ngAfterViewInit(): void {
    R.map((header: ElementRef) => {
      this.renderer.setStyle(header.nativeElement, 'width', this.container.nativeElement.clientWidth / R.head(this.dataAndConfig).length - 17 + 'px');
    }, this.headerRefs.toArray());
  }

  private createComponentFactories(components: any[]): ComponentFactory<any>[] {
    @NgModule({
      declarations: components,
      entryComponents: components
    })
    class EntryComponentsModule { }

    return this.compiler.compileModuleAndAllComponentsSync(EntryComponentsModule).componentFactories;
  }
}
