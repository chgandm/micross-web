"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var app_component_1 = require('./app.component');
var top_players_component_1 = require('./components/top-players-component/top-players.component');
var home_component_1 = require('./components/home-component/home.component');
var page_not_found_component_1 = require('./components/page-not-found-component/page-not-found.component');
var angularfire2_1 = require('angularfire2');
var players_service_1 = require('./services/players.service');
var routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'top-players', component: top_players_component_1.TopPlayersComponent },
    { path: '**', component: page_not_found_component_1.PageNotFoundComponent }
];
exports.firebaseConfig = {
    apiKey: 'AIzaSyCzNppZRdlNmyCp3R5YuiynkgIBBSJsOCY',
    authDomain: 'micross-955d7.firebaseapp.com',
    databaseURL: 'https://micross-955d7.firebaseio.com',
    storageBucket: 'micross-955d7.appspot.com',
    messagingSenderId: '499486560551'
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                top_players_component_1.TopPlayersComponent,
                page_not_found_component_1.PageNotFoundComponent
            ],
            imports: [
                router_1.RouterModule.forRoot(routes),
                angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig),
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule
            ],
            providers: [players_service_1.PlayersService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
