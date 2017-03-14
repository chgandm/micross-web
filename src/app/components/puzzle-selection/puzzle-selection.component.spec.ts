/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PuzzleSelectionComponent } from './puzzle-selection.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PuzzlePreviewComponent } from '../puzzle-preview/puzzle-preview.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PlayersService } from '../../services/players.service';
import { PuzzlesService } from '../../services/puzzles.service';
import Spy = jasmine.Spy;
import { PuzzleMetaData } from '../../shared/dto/puzzle-meta-data';
import { RouterTestingModule } from '@angular/router/testing';
import { UserServiceMockBuilder } from '../../../testutil/user-service-mock-builder';
import { UserService } from '../../services/user.service';
import { PuzzleSizeType } from '../../shared/dom/PuzzleSizeType';

class Page {
  title: HTMLElement;

  constructor(private fixture: ComponentFixture<PuzzleSelectionComponent>) {

  }

  create(): Page {
    this.title = this.fixture.debugElement.query(By.css('h1')).nativeElement;
    return this;
  }

}

describe('PuzzleSelectionComponent', () => {
  let component: PuzzleSelectionComponent;
  let fixture: ComponentFixture<PuzzleSelectionComponent>;
  let page: Page;

  let mockRouter;
  let mockActivatedRoute;
  let userService;
  let mockPuzzlesService;

  const mockPuzzleMetaData: Observable<[PuzzleMetaData]> = Observable.of([
    {$key: 'id1', order: 0, title: {en: 'test 1'}},
    {$key: 'id2', order: 0, title: {en: 'test 2'}},
    {$key: 'id3', order: 0, title: {en: 'test 3'}}
  ]);

  beforeEach(async(() => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    mockActivatedRoute = new Subject();

    userService = new UserServiceMockBuilder().setDefaultUserInfo(true).build();

    mockPuzzlesService = {
      findPuzzleDataById: jasmine.createSpy('findPuzzleDataById'), // a simple spy is enough
      findAllPuzzleMetaData: jasmine.createSpy('findAllPuzzleMetaData').and.returnValue(mockPuzzleMetaData),
      findTopPlayerTrophiesOfPuzzle: jasmine.createSpy('findTopPlayerTrophiesOfPuzzle')
    };

    TestBed.configureTestingModule({
      declarations: [ PuzzleSelectionComponent, PuzzlePreviewComponent ],
      imports: [ RouterTestingModule.withRoutes([]) ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: mockActivatedRoute } },
        { provide: PuzzlesService, useValue: mockPuzzlesService},
        { provide: UserService, useValue: userService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('in case of an unknown puzzle size', () => {

    beforeEach(() => {
      mockRouter.navigateByUrl.calls.reset();
      mockActivatedRoute.next({size: 'unknown'});
    });

    it('should navigate immediately to error page due to unknown size param', () => {
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('404');
      expect(mockPuzzlesService.findTopPlayerTrophiesOfPuzzle).not.toHaveBeenCalled();
      expect(mockPuzzlesService.findPuzzleDataById).not.toHaveBeenCalled();
      expect(mockPuzzlesService.findAllPuzzleMetaData).not.toHaveBeenCalled();
    });
  });

  describe('in case of 5x5 puzzles', () => {

    beforeEach(() => {
      mockRouter.navigateByUrl.calls.reset();

      const mockPuzzleData: Observable<number[][]> = Observable.of([[0], [0]]);
      mockPuzzlesService.findPuzzleDataById.and.returnValue(mockPuzzleData);

      mockActivatedRoute.next({size: PuzzleSizeType._5x5});
    });

    it('displays the correct title', () => {
      fixture.detectChanges();
      expect(page.create().title.innerText).toEqual('Easy Puzzles');
    });

    it('should not navigate away but instead request data from the backend', () => {
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalledWith('404');
      expect(mockPuzzlesService.findAllPuzzleMetaData).toHaveBeenCalled();
    });

    it('fetches the available puzzles', (done) => {
        fixture.detectChanges();
        expect(mockPuzzlesService.findAllPuzzleMetaData).toHaveBeenCalled();
        expect(mockPuzzlesService.findPuzzleDataById).toHaveBeenCalled();
        expect(mockPuzzlesService.findTopPlayerTrophiesOfPuzzle).toHaveBeenCalled();
        component.puzzleMetaData.take(1).subscribe((data: [PuzzleMetaData]) => {
          expect(data.length).toBe(3);
          expect(data[0].$key).toBe('id1');
          expect(data[1].$key).toBe('id2');
          expect(data[2].$key).toBe('id3');
          expect(component.loading).toBe(false);
          expect(component.dataAvailable).toBe(false); // since not the whole page size go returned
          done();
        });
    });
  });

  describe('in case of 10x10 puzzles', () => {

    beforeEach(() => {
      mockRouter.navigateByUrl.calls.reset();
      mockActivatedRoute.next({size: PuzzleSizeType._10x10});
    });

    it('displays the correct title', () => {
        fixture.detectChanges();
        expect(page.create().title.innerText).toEqual('Medium Puzzles');
    });

    it('should not navigate away but instead request data from the backend', () => {
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalledWith('404');
      expect(mockPuzzlesService.findAllPuzzleMetaData).toHaveBeenCalled();
    });
  });

  describe('in case of 15x15 puzzles', () => {

    beforeEach(() => {
      mockRouter.navigateByUrl.calls.reset();
      mockActivatedRoute.next({size: PuzzleSizeType._15x15});
    });

    it('displays the correct title', () => {
      fixture.detectChanges();
      expect(page.create().title.innerText).toEqual('Hard Puzzles');
    });

    it('should not navigate away but instead request data from the backend', () => {
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalledWith('404');
      expect(mockPuzzlesService.findAllPuzzleMetaData).toHaveBeenCalled();
    });
  });
});
