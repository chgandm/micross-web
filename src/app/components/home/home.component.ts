import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleSizeType } from '../../shared/dom/PuzzleSizeType';
import { EnvInfoService } from '../../services/env-info.service';
import { MicrossUser } from '../../shared/dom/micross-user';
import { UserService } from '../../services/user.service';


/**
 * This component provides the user's entry-point (or home) into the application from a content perspective.
 * In case the app is running in embedded (=mobile) mode, a different set of options is available to the user.
 * Please refer to the the respective test spec in order to understand which options are affected.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  user = new MicrossUser(false);
  puzzleSizeType = PuzzleSizeType;

  constructor(private envInfo: EnvInfoService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.envInfo.getUser().subscribe(user => {
      this.user = user;
    });
  }

  goToTopPlayers() {
    this.router.navigateByUrl(`/top-players`);
  }

  goToPuzzleWithSize(size: PuzzleSizeType) {
    this.router.navigateByUrl(`/select/${size}`);
  }

  goToCreatePuzzle() {
    this.router.navigateByUrl(`/create`);
  }

  logout() {
    this.userService.logout().then(() => {
      console.log('logout successful');
    });
  }
}
