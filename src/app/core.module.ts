
import { NgModule } from '@angular/core';
import { EnvInfoGuard } from './guards/envinfo.guard';
import { UserService } from './services/user.service';
import { PuzzlesService } from './services/puzzles.service';
import { PlayersService } from './services/players.service';
import { EnvInfoService } from './services/env-info.service';
import { NativeCommunicationService } from './services/native-communication.service';
/**
 * The Micross Web Core Module. As peer the Angular Guidelines (and I paraphrase the following), it
 *
 * - contains providers for the singleton services loaded when the application starts.
 * - is imported in the AppModule only (and never in any module other than the root AppModule)
 * - migh be a pure services module with no declarations.
 *
 * More recommendations available here: https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-module-recommendations
 */
@NgModule({
  providers: [
    NativeCommunicationService,
    EnvInfoService,
    PlayersService,
    PuzzlesService,
    UserService,
    EnvInfoGuard
  ]

})

export class CoreModule { }
