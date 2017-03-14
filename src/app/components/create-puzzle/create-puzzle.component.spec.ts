/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePuzzleComponent } from './create-puzzle.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { Observable } from 'rxjs/Observable';
import { PuzzlesService } from '../../services/puzzles.service';
import { baseProviders, click } from '../../../testutil/helpers';
import { By } from '@angular/platform-browser';
import { EnvInfoService } from '../../services/env-info.service';
import { EnvInfoMockBuilder } from '../../../testutil/env-info-mock-builder';
import { NativeCommunicationMockBuilder } from '../../../testutil/native-communication-mock-builder';
import { NativeCommunicationService } from '../../services/native-communication.service';

describe('CreatePuzzleComponent', () => {
  let component: CreatePuzzleComponent;
  let fixture: ComponentFixture<CreatePuzzleComponent>;
  let mockPuzzlesService;
  let envInfoMock: EnvInfoMockBuilder;
  let nativeCommMock: NativeCommunicationMockBuilder;

  beforeEach(async(() => {
    // Create a spy
    mockPuzzlesService = {
      fetchTopPlayerTrophies: jasmine
        .createSpy('createPuzzle')
        .and.returnValue(Observable.of(true))
    };

    TestBed.configureTestingModule({
      declarations: [ CreatePuzzleComponent ],
      imports: [ FormsModule, SharedModule ],
      providers:    [
        { provide: PuzzlesService, useValue: mockPuzzlesService },
        ...baseProviders
      ]
    })
    .compileComponents();

    envInfoMock = TestBed.get(EnvInfoService);
    nativeCommMock = TestBed.get(NativeCommunicationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the correct title', () => {
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerText).toEqual('Create a Puzzle');
  });

  describe('when running embedded', () => {
    let shareLink;

    beforeEach(() => {
      envInfoMock.setEmbeddedInWebView(true).build();
      fixture.detectChanges();
      shareLink = fixture.debugElement.query(By.css('a')).nativeElement;
    });

    it('an info message about sharing is displayed', () => {
      expect(shareLink.innerText).toEqual('Send yourself the link!');
    });


    it('sharing leads to the invocation of native functionality', () => {
      click(shareLink);
      fixture.detectChanges();
      expect(nativeCommMock.shareInNativeApplication.calls.any()).toBe(true);
    });

  });
});
