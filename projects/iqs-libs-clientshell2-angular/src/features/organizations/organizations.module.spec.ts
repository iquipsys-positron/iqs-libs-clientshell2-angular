import { TestBed } from '@angular/core/testing';
import { IqsOrganizationsDataService, IqsOrganizationsService } from './services/index';

import { IqsOrganizationsModule } from './organizations.module';

describe('OrganizationsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IqsOrganizationsModule]
    });
  });

  it(`should not provide 'OrganizationsService' service`, () => {
    expect(() => TestBed.get(IqsOrganizationsService)).toThrowError(/No provider for/);
  });

  it(`should provide 'OrganizationsDataService' service`, () => {
    expect(() => TestBed.get(IqsOrganizationsDataService)).toBeTruthy();
  });
});
