import { MicrossUser } from '../app/shared/dom/micross-user';
import { Observable } from 'rxjs/Observable';
import { constants } from './constants';
import Spy = jasmine.Spy;
import { UserRecord } from '../app/services/user.service';
import { PuzzleRecord } from '../app/shared/dto/puzzle-record';

export class UserServiceMockBuilder {

  // Data
  firebaseAuthState: any; // a subset of FireBaseAuthState
  user: MicrossUser;
  puzzleRecord: PuzzleRecord = {
    $key: 'record-id1',
    createdAt: 123,
    createdBy: constants.uid,
    nickname: constants.nickname,
    mistakes: 0,
    time: 123
  };
  userRecords: UserRecord[] = [
    {$key: 'id1', $value: 'record-id1'},
    {$key: 'id2', $value: 'record-id2'},
    {$key: 'id3', $value: 'record-id3'}
  ];

  // Spys
  login: Spy;
  findAllUserRecords: Spy;
  findUserRecordIdOfPuzzle: Spy;
  getUser: Spy;

  setDefaultUserInfo(loggedIn: boolean): UserServiceMockBuilder {
    return this.setUserInfo(constants.uid, constants.mail, constants.nickname, loggedIn);
  }

  setUserInfo(uid: string, email: string, nickname: string, loggedIn: boolean): UserServiceMockBuilder {
    this.user = new MicrossUser(loggedIn);
    this.user.uid = uid;
    this.user.email = email;
    this.user.nickname = nickname;
    this.user.loggedIn = loggedIn;

    if (loggedIn === true) {
      this.firebaseAuthState = {
        uid: uid,
        auth: {
          uid: uid,
          displayName: nickname,
          email: email,
          photoURL: null,
          providerId: 'password'
        }
      };
    } else {
      this.firebaseAuthState = null;
    }
    return this;
  }

  build(): UserServiceMockBuilder {
    this.login = jasmine
        .createSpy('login')
        .and.returnValue(Promise.resolve(this.firebaseAuthState));

    this.findAllUserRecords = jasmine
        .createSpy('findAllUserRecords')
        .and.returnValue(Observable.of(this.userRecords));

    this.findUserRecordIdOfPuzzle = jasmine
        .createSpy('findUserRecordIdOfPuzzle')
        .and.returnValue(Observable.of(this.puzzleRecord));

    this.getUser = jasmine
      .createSpy('getUser')
      .and.returnValue(Observable.of(this.user));
    return this;
  }
}
