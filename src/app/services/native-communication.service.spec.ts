/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NativeCommunicationService } from './native-communication.service';

describe('NativeCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeCommunicationService]
    });
  });

  it('should create', inject([NativeCommunicationService], (service: NativeCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
