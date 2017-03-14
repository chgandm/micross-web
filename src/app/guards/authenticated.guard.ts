import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';

/**
 * Allow only authenticated users.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {

  }

  canActivate(): Observable<boolean> {
    console.log('AuthenticatedGuard#canActivate called');
    return this.userService.getUser()
      .map(user => {
        if (user.loggedIn === true) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      });
  }
}
