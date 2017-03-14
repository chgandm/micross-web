/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PuzzleRankingComponent } from './puzzle-ranking.component';
import { PuzzlePreviewComponent } from '../puzzle-preview/puzzle-preview.component';
import { PuzzleTimePipe } from '../../pipes/puzzle-time.pipe';
import { ActivatedRoute } from '@angular/router';
import { PuzzlesService } from '../../services/puzzles.service';
import { baseProviders, click } from '../../../testutil/helpers';
import { EnvInfoService } from '../../services/env-info.service';
import { NativeCommunicationService } from '../../services/native-communication.service';
import { EnvInfoMockBuilder } from '../../../testutil/env-info-mock-builder';
import { NativeCommunicationMockBuilder } from '../../../testutil/native-communication-mock-builder';
import { Observable } from 'rxjs';
import { DebugElement } from '@angular/core';

class Page {
  title: HTMLElement;
  puzzleName: HTMLElement;
  puzzleSize: HTMLElement;
  playButton: DebugElement;

  constructor(private fixture: ComponentFixture<PuzzleRankingComponent>) { }

  create(): Page {
    this.title = this.fixture.debugElement.query(By.css('h1')).nativeElement;
    this.puzzleName = this.fixture.debugElement.query(By.css('.puzzle__name')).nativeElement;
    this.puzzleSize = this.fixture.debugElement.query(By.css('.puzzle__size')).nativeElement;
    this.playButton = this.fixture.debugElement.query(By.css('.btn-c_primary'));
    return this;
  }
}

describe('PuzzleRankingComponent', () => {
  let component: PuzzleRankingComponent;
  let fixture: ComponentFixture<PuzzleRankingComponent>;
  let page: Page;

  let mockPuzzlesService;
  let envInfoMock: EnvInfoMockBuilder;
  let nativeCommMock: NativeCommunicationMockBuilder;


  beforeEach(async(() => {
    mockPuzzlesService = {
      findPuzzleDataById: jasmine.createSpy('findPuzzleDataById').and.returnValue(
        Observable.of([0, 1])
      ),
      findPuzzleMetaDataById: jasmine.createSpy('findPuzzleMetaDataById').and.returnValue(
        Observable.of({ title: { en: 'Test Puzzle' }, author: 'Testaccount', size: '5x5' })
      ),
      findRecordsById: jasmine.createSpy('findRecordsById') // TODO: And return
    };

    TestBed.configureTestingModule({
      declarations: [ PuzzleRankingComponent, PuzzlePreviewComponent, PuzzleTimePipe ],
      providers: [
        { provide: PuzzlesService, useValue: mockPuzzlesService},
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': 'id-irrelevant-due-to-mock', 'size': '5x5' }]) } },
        ...baseProviders
      ]
    })
    .compileComponents();

    envInfoMock = TestBed.get(EnvInfoService);
    nativeCommMock = TestBed.get(NativeCommunicationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the correct title', () => {
    expect(page.create().title.innerText).toEqual('Ranking');
  });

  it('displays the puzzles name', () => {
    expect(page.create().puzzleName.innerText).toEqual('Test Puzzle');
  });

  it('displays the puzzles size', () => {
    expect(page.create().puzzleSize.innerText).toEqual('5x5');
  });

  describe('when running embedded', () => {

    beforeEach(() => {
      envInfoMock.setEmbeddedInWebView(true).build();
      fixture.detectChanges();
    });

    it('a play now button is displayed', () => {
      expect(page.create().playButton).not.toBeNull();
      expect(page.create().playButton.nativeElement.innerText).toEqual('Play Now!');
    });


    it('clicking play now leads to the invocation of native functionality', () => {
      click(page.create().playButton);
      expect(nativeCommMock.playInNativeApplication.calls.any()).toBe(true);
    });

  });
});
