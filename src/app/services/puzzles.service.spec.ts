/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { PuzzlesService } from './puzzles.service';
import { AngularFireModule, AngularFire } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PuzzleMetaData } from '../shared/dto/puzzle-meta-data';
import { UserService } from './user.service';
import { constants } from '../../testutil/constants';
import { PuzzleRecord } from '../shared/dto/puzzle-record';
import { firebaseAuthConfig } from '../app.constants';

describe('PuzzlesService', () => {

  let service: PuzzlesService;
  let userService: UserService;
  let af: AngularFire;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularFire, PuzzlesService, UserService],
      imports: [ AngularFireModule.initializeApp(environment.firebaseConfig, firebaseAuthConfig) ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(PuzzlesService);
    userService = TestBed.get(UserService);
    af = TestBed.get(AngularFire);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('provides the basis for a reactive UI by returning subscribable Observers', () => {
    it('when searching all available puzzle meta data', () => {
      expect(service.findAllPuzzleMetaData('', 0, new Subject())).toBeDefined('subscribe()');
    });

    it('when searching for specific puzzle data', () => {
      expect(service.findPuzzleDataById('')).toBeDefined('subscribe()');
    });

    it('when searching for specific puzzle meta data', () => {
      expect(service.findPuzzleMetaDataById('', '')).toBeDefined('subscribe()');
    });

    it('when searching for specific records', () => {
      expect(service.findRecordsById('')).toBeDefined('subscribe()');
    });
  });

  describe('when NOT logged in', ()  => {

    beforeEach((done) => {
      af.auth.logout().then(() => done()).catch(() => done());
    });

    it ('returns all available puzzle meta data', (done) => {
      service.findAllPuzzleMetaData('5x5', 5, new BehaviorSubject(1)).first().subscribe((data: [PuzzleMetaData]) => {
        expect(data.length).toEqual(1);
        expect(data[0].title.en).toEqual('Test5x5');
        done();
      });
    });

    it ('returns specific puzzle meta data', (done) => {
      service.findPuzzleMetaDataById('-KeEKF5KB7mCg6Rq7bpW', '5x5').first().subscribe((data: PuzzleMetaData) => {
        expect(data.title.en).toEqual('Test5x5');
        done();
      });
    });

    it ('does not return puzzle data', (done) => {
      service.findPuzzleDataById('-KeEKF5KB7mCg6Rq7bpW').first().subscribe(() => { }, err => {
        expect(err).not.toBeNull();
        done();
      });
    });

    it('returns specific records of a puzzle ordered by completion time', (done) => {
      service.findRecordsById('-KeEKF5KB7mCg6Rq7bpW').first().subscribe((data: [PuzzleRecord]) => {
        expect(data.length).toEqual(3);
        expect(data[0].createdBy).toEqual('OLQM0x4qofXqxvAv1lFcrnr59Mj2');
        expect(data[0].createdAt).toEqual(1488465044845);
        expect(data[0].mistakes).toEqual(0);
        expect(data[0].nickname).toEqual('testaccount');
        expect(data[0].time).toEqual(3345);
        expect(data[0].time).toBeLessThan(data[1].time);
        expect(data[1].time).toBeLessThan(data[2].time);
        done();
      });
    });

  });

  describe('when logged in', ()  => {

    beforeEach((done) => {
      userService.login(constants.mail, constants.password)
        .then(() => done());
    });

    it ('does return puzzle data', (done) => {
      service.findPuzzleDataById('-KeEKF5KB7mCg6Rq7bpW').first().subscribe((data: number[][]) => {
        expect(data.length).toEqual(5);
        expect(data[0].length).toEqual(5);
        done();
      });
    });

  });

});
