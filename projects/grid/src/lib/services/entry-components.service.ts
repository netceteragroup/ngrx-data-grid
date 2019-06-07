import { EntryComponentsConfig } from '@grid/config/entry-components-config';

export class EntryComponentsService {

  private entryComponents: EntryComponentsConfig[];

  constructor(config: EntryComponentsConfig) {
    this.entryComponents = config.entryComponents;
  }

  get entryComponentsArray(): any[] {
    return this.entryComponents;
  }
}
