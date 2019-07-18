import { EntryComponentsConfig } from '../../config';

export class EntryComponentsService {

  private readonly entryComponents: EntryComponentsConfig[];

  constructor(config: EntryComponentsConfig) {
    this.entryComponents = config.entryComponents;
  }

  get entryComponentsArray(): any[] {
    return this.entryComponents;
  }
}
