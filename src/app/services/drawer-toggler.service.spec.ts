import { TestBed } from '@angular/core/testing';

import { DrawerTogglerService } from './drawer-toggler.service';

describe('DrawerTogglerService', () => {
  let service: DrawerTogglerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerTogglerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
