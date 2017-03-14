import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import DataSnapshot = firebase.database.DataSnapshot;
import { PuzzleTrophies } from '../shared/dto/puzzle-trophies';

/**
 * Accesses the Firebase backend and converts the data received into @type{PuzzleTrophies}
 * or other Micross domain objects. Provides Observables to the caller in order to allow for reactive
 * behavior of the UI, facilitated by the Firebase realtime database.
 */
@Injectable()
export class PlayersService {

  constructor(private angularFire: AngularFire) { }

  // TODO: Currently unused
  fetchTopPlayerTrophies(): Observable<[PuzzleTrophies]> {
    return this.angularFire.database.list('/topPlayers');
  }

}
