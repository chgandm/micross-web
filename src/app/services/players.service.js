"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
/**
 * Accesses the Firebase backend and converts the data received into @Type {PuzzleTrophies}.
 * Provides Observables to the caller in order to ensure reactive behavior of the UI, facilitated by the Firebase
 * realtime database.
 */
var PlayersService = (function () {
    function PlayersService(angularFire) {
        this.angularFire = angularFire;
    }
    PlayersService.prototype.fetchTopPlayerTrophies = function () {
        // note: we could have used 'rxjs/add/operator/take'; in order to not continuously subscribe but mimic a Firebase 'once'
        return this.angularFire.database.list('/topPlayers', { preserveSnapshot: true })
            .flatMap(function (list) { return list; })
            .map(function (snapshot) { return snapshot.val(); });
    };
    PlayersService = __decorate([
        core_1.Injectable()
    ], PlayersService);
    return PlayersService;
}());
exports.PlayersService = PlayersService;
