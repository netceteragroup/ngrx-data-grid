import { InjectionToken } from '@angular/core';

export interface NgrxGridConfig {
  stateKey?: string;
}

export const GridStoreConfig = new InjectionToken<NgrxGridConfig>('ngrx-data-grid/grid-store-config');
export const InternalGridStoreConfig = new InjectionToken<NgrxGridConfig>('ngrx-data-grid/internal-grid-store-config');
