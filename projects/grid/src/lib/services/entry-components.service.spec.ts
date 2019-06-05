import { EntryComponentsConfig, EntryComponentsService } from '@grid/services/entry-components.service';

class MockCell {
}

class MockText {
}

describe('EntryComponentService', () => {

  let service: EntryComponentsService;
  let entryComponentsConfig: EntryComponentsConfig;

  beforeEach(() => {
    entryComponentsConfig = new EntryComponentsConfig();
    entryComponentsConfig.entryComponents = [MockCell, MockText];
    service = new EntryComponentsService(entryComponentsConfig);
  });

  it('should return array of components', () => {
    expect(service.entryComponentsArray).toEqual([MockCell, MockText]);
  });

});
