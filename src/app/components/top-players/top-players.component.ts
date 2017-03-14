import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { PlayersService } from '../../services/players.service';
import { PuzzleTrophies } from '../../shared/dto/puzzle-trophies';


/**
 * This component continuously fetches data from the Firebase backend by subscribing to the data supplied by the @type {PlayersService},
 * computing a leaderboard of the 10 top Micross players. If data changes in the backend, these changes are automatically reflected on the UI.
 */
/*
TODO: re-enable once node.js backend is up and running:
@Component({
  selector: 'app-top-players',
  templateUrl: 'top-players.component.html',
  styleUrls: ['top-players.component.scss']
})
*/
export class TopPlayersComponent implements OnInit, OnDestroy {

  /**
   * Data Bindings`
   */
  topCount = 10;
  leaderBoard: Player[] = [];
  loading: boolean;

  /**
   * Members
   */
  topPlayersSubscription: Subscription;

  constructor(private playersService: PlayersService) {

  }


  ngOnInit(): void {
    this.loading = true;
    // note: we could have used 'rxjs/add/operator/take'; in order to not continuously subscribe but mimic a Firebase 'once'
    const topPlayerTrophies: Observable<[PuzzleTrophies]> = this.playersService.fetchTopPlayerTrophies();

    // Request the data and compute the ranking
    this.topPlayersSubscription = topPlayerTrophies.subscribe(trophiesList => {
      const players = new Leaderboard();
      trophiesList.forEach(trophies => {
        players.countGoldTrophy(trophies.gold);
        players.countSilverTrophy(trophies.silver);
        players.countBronzeTrophy(trophies.bronze);
      });
      this.leaderBoard = players.computeTop(this.topCount);
      this.loading = false;
    });

}

  ngOnDestroy(): void {
    this.topPlayersSubscription.unsubscribe();
  }
}

/**
 * Holds the top players and computes a ranked list of players.
 */
class Leaderboard {
  private players = new Map<string, Player>();

  countGoldTrophy(nickname: string) {
    this.getPlayerPosition(nickname).incGold();
  }

  countSilverTrophy(nickname: string) {
    this.getPlayerPosition(nickname).incSilver();
  }

  countBronzeTrophy(nickname: string) {
    this.getPlayerPosition(nickname).incBronze();
  }

  computeTop(count: number): Player[] {
    const top10: Player[] = [];
    this.players.forEach((position: Player) => top10.push(position));
    return top10
      .sort((a, b) => -a.calculatePoints() + b.calculatePoints())
      .slice(0, count);

  }

  private getPlayerPosition(nickname: string): Player {
    if (!this.players.has(nickname)) {
      this.players.set(nickname, new Player(nickname));
    }
    return this.players.get(nickname);
  }

}

/**
 * Represents a single player in the leaderboard.
 */
class Player {
  public gold = 0;
  public silver = 0;
  public bronze = 0;

  constructor(public nickname: string) { }

  incGold() {
  this.gold++;
}

  incSilver() {
    this.silver++;
  }


  incBronze() {
    this.bronze++;
  }

  calculatePoints(): number {
    return this.gold * 3 + this.silver * 2 + this.bronze;
  }
}
