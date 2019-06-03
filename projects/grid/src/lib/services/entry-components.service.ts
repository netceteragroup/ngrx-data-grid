import { Injectable, Optional } from '@angular/core';

export class EntryComponentsConfig {
  entryComponents: any[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class EntryComponentsService {

  private entryComponents: EntryComponentsConfig[];

  constructor(@Optional() entry: EntryComponentsConfig) {
    if (entry) {
      this.entryComponents = [...entry.entryComponents];
    }
  }

  get entryComponentsArray() {
    return this.entryComponents;
  }

}
