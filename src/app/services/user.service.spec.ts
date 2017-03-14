/* tslint:disable:no-unused-variable */

import { TestBed, inject, async } from '@angular/core/testing';
import { AngularFireModule, AngularFire, FirebaseAuthState } from 'angularfire2';
import { environment } from '../../environments/environment';
import { UserService, UserRecord } from './user.service';
import { constants } from '../../testutil/constants';
import { firebaseAuthConfig } from '../app.constants';

describe('UserService', () => {
  const newUserMail = 'new@user.mail';
  const newUserPassword = 'password';
  let userService: UserService;
  let af: AngularFire;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularFire, UserService],
      imports: [ AngularFireModule.initializeApp(environment.firebaseConfig, firebaseAuthConfig) ]
    });
    userService = TestBed.get(UserService);
    af = TestBed.get(AngularFire);
  });

  afterAll((done) => {
    // cleanup created users if they exist
    af.auth.login({email: newUserMail, password: newUserPassword})
      .then((authState: FirebaseAuthState) => {
        authState.auth.delete().then(() => done()).catch(() => done());
    }).catch(() => done());
  });

  it('should create', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should login with correct credentials', (done) => {
    userService.login(constants.mail, constants.password)
      .then((authState: FirebaseAuthState) => {
        expect(authState).not.toBeNull();
        expect(authState.uid).toEqual('OLQM0x4qofXqxvAv1lFcrnr59Mj2');
        done();
    });
  });

  it('should refuse login with incorrect credentials', (done) => {
    userService.login(constants.mail, 'that is probably wrong')
      .catch(err => {
        expect(err.code).toEqual('auth/wrong-password');
        done();
    });
  });

  it('should be able to register new users', (done) => {
    userService.register(newUserMail, newUserPassword)
      .then((authState: FirebaseAuthState) => {
        expect(authState).not.toBeNull();
        expect(authState.auth.email).toEqual(newUserMail);
        done();
      });
  });



  describe('when NOT logged in', () => {

    beforeEach((done) => {
      af.auth.logout().then(() => done()).catch(() => done());
    });

    it('should return no user information', (done) => {
      userService.getUser().first().subscribe(user => {
        expect(user.uid).toBeUndefined();
        expect(user.loggedIn).toBe(false);
        done();
      });
    });

    it('should NOT return any of the users personal records', (done) => {
      userService.findAllUserRecords(constants.uid).first().subscribe(() => {}, (error) => {
        expect(error).not.toBeNull();
        done();
      });
    });


    it('should NOT return a specific personal records', (done) => {
      userService.findUserRecordIdOfPuzzle(constants.uid, constants.puzzle_5x5).first().subscribe(() => {}, (error) => {
        expect(error).not.toBeNull();
        done();
      });
    });

  });


  describe('when logged in', () => {

    beforeEach((done) => {
      userService.login(constants.mail, constants.password)
        .then(() => done());
    });

    it('should return the available user information when a user is logged in', (done) => {
      userService.getUser().first().subscribe(user => {
        expect(user.uid).toEqual(constants.uid);
        expect(user.email).toEqual(constants.mail);
        expect(user.nickname).toEqual(constants.nickname);
        expect(user.loggedIn).toBe(true);
        done();
      });
    });

    it('should return all of the users personal records', (done) => {
      userService.findAllUserRecords(constants.uid).first().subscribe((records: UserRecord[]) => {
        expect(records.length).toBe(1);
        expect(records[0].$key).not.toBeNull();
        expect(records[0].$key).toBe(constants.puzzle_5x5);
        done();
      });
    });

    it('should return a specific record of a user for a particular puzzle', (done) => {
      userService.findUserRecordIdOfPuzzle(constants.uid, constants.puzzle_5x5).first().subscribe((records: string) => {
        expect(records).toBe(constants.puzzle_5x5_recordId);
        done();
      });
    });

  });



});
