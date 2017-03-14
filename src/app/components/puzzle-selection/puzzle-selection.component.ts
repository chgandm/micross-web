import {
  Component, OnInit, OnDestroy, trigger, transition, style,
  animate
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/combineLatest';
import { PuzzlesService } from '../../services/puzzles.service';
import { UserService, UserRecord } from '../../services/user.service';
import { PuzzleMetaData } from '../../shared/dto/puzzle-meta-data';
import { PuzzleTrophies } from '../../shared/dto/puzzle-trophies';
import { isUndefined } from 'util';
import { MicrossUser } from '../../shared/dom/micross-user';
import { microssPuzzleSize } from '../../app.constants';

/**
 * Acts as the puzzle master page (to the ranking component which can be thought of as a detail page).
 */
@Component({
  selector: 'app-puzzle-selection',
  templateUrl: 'puzzle-selection.component.html',
  styleUrls: ['puzzle-selection.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class PuzzleSelectionComponent implements OnInit, OnDestroy {

  title = 'Puzzles';
  routeSub: Subscription;

  puzzleMetaData: Observable<[PuzzleMetaData]>;
  puzzlePreviews = new Map<string, Observable<number[][]>>();
  puzzleTrophies = new Map<string, Observable<PuzzleTrophies>>();
  puzzleType: any;

  pageSize = 5;
  pageNumber: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  loading: boolean;
  dataAvailable: boolean;
  lastCount = 0;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private puzzlesService: PuzzlesService,
              private router: Router) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.puzzleType = microssPuzzleSize.get(+params['size']);
      this.dataAvailable = false;
      this.loading = true;
      if (isUndefined(this.puzzleType)) {
        this.router.navigateByUrl('404');
        return;
      }

      this.title = `${this.puzzleType.name} Puzzles`;
      this.puzzleMetaData = this.puzzlesService.findAllPuzzleMetaData(this.puzzleType.id, this.pageSize, this.pageNumber);
      this.fetchTrophiesForPuzzles();
      this.determineMoreDataAvailable();
      this.userService.getUser().subscribe((user: MicrossUser) => {
        if (user.loggedIn === true) {
          this.fetchPreviewsForPuzzlesBasedOnLoggedInUser(user.uid);
        }
      });

    });

  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  trackByPuzzleId(index: number, puzzle: PuzzleMetaData) {
    return puzzle.$key;
  }

  goToRanking(puzzleId: string) {
    this.router.navigate(['ranking', puzzleId, this.puzzleType.id], { relativeTo: this.route });
  }

  loadMore(): void {
    this.loading = true;
    this.dataAvailable = false;
    this.pageNumber.next(this.pageNumber.getValue() + 1);
  }

  evaluatePictogrammClasses() {
    if (!isUndefined(this.puzzleType)) {
      return new Map([
        ['5x5', 'icon-square color-bronze'],
        ['10x10', 'icon-th-large color-silver'],
        ['15x15', 'icon-th color-gold']
      ]).get(this.puzzleType.id);
    }
  }

  private fetchTrophiesForPuzzles() {
    if (this.puzzleMetaData != null) {
      this.puzzleMetaData.flatMap(l => l).subscribe(puzzle => {
        const puzzleId = puzzle.$key;
        this.puzzleTrophies.set(puzzleId, this.puzzlesService.findTopPlayerTrophiesOfPuzzle(puzzleId));
      });
    }
  }

  private fetchPreviewsForPuzzlesBasedOnLoggedInUser(uid: string) {
    // map the puzzleData meta data to an array of strings containing just the puzzleData IDs
    const availablePuzzlesObs: Observable<[string]> = this.puzzleMetaData
      .map((list: [PuzzleMetaData]) => list.map(metaData => metaData.$key));

    // map the solved puzzles by the user to an array of strings also containing just the puzzleData IDs
    const solvedPuzzlesObs: Observable<[string]> = this.userService.findAllUserRecords(uid)
      .map((list: [UserRecord]) => list.map(userRecord => userRecord.$key));

    // combine the data streams: if either one of the streams emits data, we filter the available puzzles
    const filteredForUser = availablePuzzlesObs.combineLatest(solvedPuzzlesObs,
      (availablePuzzles: [string], solvedPuzzles: [string]) => {
        this.puzzlePreviews = new Map<string, Observable<number[][]>>();
        return availablePuzzles.filter(puzzleId => {
          return (solvedPuzzles.indexOf(puzzleId) >= 0);
        });
      });

    // we fetch the puzzleData data for available puzzles that have been solved by the user
    filteredForUser.flatMap(l => l).subscribe(puzzleId => {
      this.puzzlePreviews.set(puzzleId, this.puzzlesService.findPuzzleDataById(puzzleId));
    });
  }

  private determineMoreDataAvailable() {
    if (this.puzzleMetaData != null) {
      this.puzzleMetaData.subscribe(puzzles => {
        if (puzzles.length > this.lastCount && (puzzles.length - this.lastCount) >= this.pageSize) {
          this.lastCount = puzzles.length;
          this.dataAvailable = true;
        }
        this.loading = false;
      });
    }
  }
}
