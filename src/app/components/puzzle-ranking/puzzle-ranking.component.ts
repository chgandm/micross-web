import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { PuzzlesService } from '../../services/puzzles.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { EnvInfoService } from '../../services/env-info.service';
import { NativeCommunicationService } from '../../services/native-communication.service';
import { isNullOrUndefined } from 'util';
import { MicrossUser } from '../../shared/dom/micross-user';
import { UserService } from '../../services/user.service';
import { PuzzleRecord } from '../../shared/dto/puzzle-record';
import { PuzzleMetaData } from '../../shared/dto/puzzle-meta-data';

/**
 * Acts as the puzzle detail page (to the selection page which can be thought of as a master), and displays
 * the available metadata of the puzzle as well as a table of high scores/records. Additionally, in case
 * - the user is logged in, a preview picture is shown
 * - the component is embedded on a mobile device, it allows to natively jump into the puzzle.
 */
@Component({
  selector: 'app-puzzle-ranking',
  templateUrl: 'puzzle-ranking.component.html',
  styleUrls: ['puzzle-ranking.component.scss']
})
export class PuzzleRankingComponent implements OnInit, OnDestroy {
  routeSub: Subscription;
  puzzleId: string;
  puzzleSize: string;

  puzzlePreview: Observable<number[][]>;
  puzzleMetaData: Observable<PuzzleMetaData>;
  ranking: Observable<[PuzzleRecord]>;

  constructor(private route: ActivatedRoute,
              private puzzlesService: PuzzlesService,
              private envInfo: EnvInfoService,
              private userService: UserService,
              private nativeService: NativeCommunicationService) { }

  ngOnInit() {
    const user = this.envInfo.getUser();
    this.routeSub = this.route.params.subscribe(params => {
      this.puzzleId = params['id'];
      this.puzzleSize = params['size'];
      this.puzzleMetaData = this.puzzlesService.findPuzzleMetaDataById(this.puzzleId, this.puzzleSize).take(1);
      this.ranking = this.puzzlesService.findRecordsById(this.puzzleId);
      this.puzzlePreview = this.getPuzzlePreview(user, this.puzzleId);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub != null) {
      this.routeSub.unsubscribe();
    }
  }

  play() {
    this.nativeService.playInNativeApplication(this.puzzleId, this.puzzleSize);
  }

  private getPuzzlePreview(user: Observable<MicrossUser>, puzzleId: string): Observable<number[][]> {
    return user
      .filter(usr => usr.loggedIn === true)
      .flatMap(usr => this.userService.findUserRecordIdOfPuzzle(usr.uid, puzzleId))
      .filter(recordId => !isNullOrUndefined(recordId))
      .map(hasRecord => this.puzzlesService.findPuzzleDataById(puzzleId))
      .flatMap(res => res);
  }

}
