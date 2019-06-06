import { EntryComponentsService } from '@grid/services/entry-components.service';

class MockCell {
}

class MockText {
}

describe('EntryComponentService', () => {

  let service: EntryComponentsService;

  beforeEach(() => {
    service = new EntryComponentsService({entryComponents: [MockCell, MockText]});
  });

  it('should return array of components', () => {
    expect(service.entryComponentsArray).toEqual([MockCell, MockText]);
  });
});
