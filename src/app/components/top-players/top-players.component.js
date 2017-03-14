"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
/**
 * This component continuously fetches data from the Firebase backend by subscribing to the data supplied by the @type {PlayersService},
 * computing a leaderboard of the 10 top Micross players. If data changes in the backend, these changes are automatically reflected on the UI.
 */
var TopPlayersComponent = (function () {
    function TopPlayersComponent(playersService) {
        this.playersService = playersService;
        /**
         * Data Bindings
         */
        this.topCount = 10;
        this.title = 'Top Players';
        this.leaderBoard = [];
    }
    TopPlayersComponent.prototype.ngOnInit = function () {
        var _this = this;
        // note: we could have used 'rxjs/add/operator/take'; in order to not continuously subscribe but mimic a Firebase 'once'
        var topPlayerTrophies = this.playersService.fetchTopPlayerTrophies();
        // Request the data and compute the ranking
        var players = new Leaderboard();
        this.topPlayersSubscription = topPlayerTrophies.subscribe(function (trophies) {
            players.countGoldTrophy(trophies.gold);
            players.countSilverTrophy(trophies.silver);
            players.countBronzeTrophy(trophies.bronze);
            _this.leaderBoard = players.computeTop(_this.topCount);
        });
    };
    TopPlayersComponent.prototype.ngOnDestroy = function () {
        this.topPlayersSubscription.unsubscribe();
    };
    TopPlayersComponent = __decorate([
        core_1.Component({
            selector: 'app-top-players',
            templateUrl: 'top-players.component.html',
            styleUrls: ['top-players.component.css']
        })
    ], TopPlayersComponent);
    return TopPlayersComponent;
}());
exports.TopPlayersComponent = TopPlayersComponent;
/**
 * Holds the top players and computes a ranked list of players.
 */
var Leaderboard = (function () {
    function Leaderboard() {
        this.players = new Map();
    }
    Leaderboard.prototype.countGoldTrophy = function (nickname) {
        this.getPlayerPosition(nickname).incGold();
    };
    Leaderboard.prototype.countSilverTrophy = function (nickname) {
        this.getPlayerPosition(nickname).incSilver();
    };
    Leaderboard.prototype.countBronzeTrophy = function (nickname) {
        this.getPlayerPosition(nickname).incBronze();
    };
    Leaderboard.prototype.computeTop = function (count) {
        var top10 = [];
        this.players.forEach(function (position) { return top10.push(position); });
        return top10
            .sort(function (a, b) { return -a.calculatePoints() + b.calculatePoints(); })
            .slice(0, count);
    };
    Leaderboard.prototype.getPlayerPosition = function (nickname) {
        if (!this.players.has(nickname)) {
            this.players.set(nickname, new Player(nickname));
        }
        return this.players.get(nickname);
    };
    return Leaderboard;
}());
/**
 * Represents a single player in the leaderboard.
 */
var Player = (function () {
    function Player(nickname) {
        this.nickname = nickname;
        this.gold = 0;
        this.silver = 0;
        this.bronze = 0;
    }
    Player.prototype.incGold = function () {
        this.gold++;
    };
    Player.prototype.incSilver = function () {
        this.silver++;
    };
    Player.prototype.incBronze = function () {
        this.bronze++;
    };
    Player.prototype.calculatePoints = function () {
        return this.gold * 3 + this.silver * 2 + this.bronze;
    };
    return Player;
}());
