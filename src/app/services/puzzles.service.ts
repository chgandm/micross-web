import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';
import { Puzzle } from '../shared/dom/Puzzle';
import ServerValue = firebase.database.ServerValue;
import { PuzzleRecord } from '../shared/dto/puzzle-record';
import { PuzzleMetaData } from '../shared/dto/puzzle-meta-data';
import { PuzzleTrophies } from '../shared/dto/puzzle-trophies';
/**
 * Accesses the Firebase backend and converts the data received into typed objects.
 * Provides Observables to the caller in order to ensure reactive behavior of the UI, facilitated by the Firebase
 * realtime database.
 */
@Injectable()
export class PuzzlesService {

  constructor(private angularFire: AngularFire) { }

  /**
   * Finds all puzzleData meta data of the specified size and pages the data dynamically according to the
   * supplied parameters.
   *
   * @param puzzleSize the requested puzzleData size
   * @param pageSize the number of puzzles to request per page
   * @param pageNumber the page number to request. By providing an observable Subject instead of the actual pageNumber,
   * AngularFire is able to react dynamically to the changing query parameters.
   * @returns {FirebaseListObservable<any[]>}
   */
  findAllPuzzleMetaData(puzzleSizeId: string, pageSize: number, pageNumber: Subject<number>): Observable<[PuzzleMetaData]> {
    return this.angularFire.database.list(`/puzzles/metadata/${puzzleSizeId}`, {
      query: {
        limitToFirst: pageNumber.map(v => v * pageSize)
      }
    });
  }

  findPuzzleDataById(puzzleId: string): Observable<number[][]> {
    return this.angularFire.database.object(`/puzzles/data/${puzzleId}`)
      .map(data => data.puzzle);
  }

  findPuzzleMetaDataById(id: string, puzzleSize: string): Observable<PuzzleMetaData> {
    return this.angularFire.database.object(`/puzzles/metadata/${puzzleSize}/${id}`);
  }

  findRecordsById(id: string): Observable<[PuzzleRecord]> {
    return this.angularFire.database.list(`/puzzleRecords/${id}/records`, {
      query: {
        orderByChild: 'time',
      }
    });
  }

  findTopPlayerTrophiesOfPuzzle(puzzleId: string): Observable<PuzzleTrophies> {
    return this.angularFire.database.list(`/puzzleRecords/${puzzleId}/records/`, {
      query: {
        orderByChild: 'time',
        limitToFirst: 3
      }
    }).flatMap((playerRecords: [PuzzleRecord]) => {
      return Observable.of({
        gold: (playerRecords.length >= 1) ? playerRecords[0].nickname : null,
        silver: (playerRecords.length >= 2) ? playerRecords[1].nickname : null,
        bronze: (playerRecords.length === 3) ? playerRecords[2].nickname : null
      });
    });
  }

  createPuzzle(puzzle: Puzzle, puzzleSize: string): Promise<any> {
    const metaDataRef = firebase.database().ref('/puzzles/');
    // Generate a new push ID for the new puzzle
    const newPuzzleRef = metaDataRef.push();
    const newPuzzleKey = newPuzzleRef.key;
    // Create the data we want to update
    const puzzleData = {};
    puzzleData[`metadata/${puzzleSize}/${newPuzzleKey}`] = {
      author: puzzle.author,
      createdBy: puzzle.createdBy,
      createdAt: ServerValue.TIMESTAMP,
      order: 99,
      size: puzzleSize,
      title: {
        en: puzzle.puzzleName
      },
      type: 'user'
    };
    puzzleData[`data/${newPuzzleKey}`] = {
      puzzle: puzzle.puzzleData
    };
    // Do a deep-path update
    return Promise.resolve(metaDataRef.update(puzzleData));
  }
}

