import { Injectable } from '@angular/core';
import * as R from 'ramda';
import { DEFAULT_LOCALE_TEXTS } from '../constants';
import { GridTranslateService } from './grid-translate.service';

@Injectable()
export class GridDefaultTranslateService implements GridTranslateService {
  translate(key: string): string {
    const localeTextPath = R.split('.', key);

    return R.path(localeTextPath, DEFAULT_LOCALE_TEXTS);
  }
}
