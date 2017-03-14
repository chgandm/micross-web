import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { MicrossUser } from '../shared/dom/micross-user';
import User = firebase.User;

/**
 * Provides a thin abstraction from the Firebase backend. Subscribe to the respective
 * @type{Observable<AngularFireAuth>} in order to receive notifications on authentication state changes.
 */
@Injectable()
export class UserService {

  constructor(private af: AngularFire) {

  }

  public getUser(): Observable<MicrossUser> {
    return this.af.auth.map(authState => {
      const user = new MicrossUser(false);
      if (!isNullOrUndefined(authState)) {
        user.uid = authState.auth.uid;
        user.email = authState.auth.email;
        user.nickname = authState.auth.displayName;
        user.loggedIn = true;
      }
      return user;
    });
  }

  login(email: string, password: string): Promise<FirebaseAuthState> {
    return Promise.resolve(this.af.auth.login({
      email: email,
      password: password
    }));
  }

  logout(): Promise<void> {
    return this.af.auth.logout();
  }

  register(email: string, password: string): Promise<FirebaseAuthState> {
    return Promise.resolve(
      this.af.auth.createUser({email: email, password: password})
    );
  }

  updateNickname(nickname: string, user: User): Promise<any> {
    return Promise.resolve(
      user.updateProfile({displayName: nickname, photoURL: null})
    );
  }

  /**
   * Finds the user's records for any completed puzzles.
   *
   * @param userId the user's identification
   * @returns {Observable<[UserRecord]>}
   */
  findAllUserRecords(userId: string): Observable<[UserRecord]> {
    return this.af.database.list(`/userRecords/${userId}`);
  }

  /**
   * Finds the user's record for the specified puzzle
   *
   * @param userId the user's identification
   * @param puzzleId the puzzle
   * @returns {Observable<string>}
   */
  findUserRecordIdOfPuzzle(userId: string, puzzleId: string): Observable<string> {
    return this.af.database
      .object(`/userRecords/${userId}/${puzzleId}`)
      .map(data => data.$value);
  }
}

export interface UserRecord {
  $key: string;
  $value: string;
}
