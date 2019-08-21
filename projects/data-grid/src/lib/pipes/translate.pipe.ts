import { Pipe, PipeTransform } from '@angular/core';
import { GridTranslateService } from '../services/grid-translate.service';

@Pipe({
  name: 'ngrxTranslate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private gridTranslateService: GridTranslateService) {}

  transform(value: any, ...args: any[]): any {
    return this.gridTranslateService.translate(value);
  }

}
