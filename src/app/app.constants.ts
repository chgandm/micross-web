import { Routes } from '@angular/router';
import { EnvInfoGuard } from './guards/envinfo.guard';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthProviders, AuthMethods } from 'angularfire2';
import { PuzzleSizeType } from './shared/dom/PuzzleSizeType';

export const routeToken = {
  root: '',
  home: 'home',
  support: 'support',
  login: 'login',
  select: 'select',
  create: 'create',
  wildcard: '**'
};

export const routes: Routes = [
  { path: routeToken.root, canActivate: [EnvInfoGuard],  children: [
    {path: routeToken.root, redirectTo: '/home', pathMatch: 'full'},
    {path: routeToken.home, component: HomeComponent},
    {path: routeToken.support, loadChildren: './components/support/support.module#SupportModule'},
    {path: routeToken.login, loadChildren: './components/login/login.module#LoginModule' },
    /* TODO: re-enable once node.js backend is up and running: {path: 'top-players', component: TopPlayersComponent}, */
    {path: routeToken.select + '/:size', loadChildren: './components/puzzle-selection/puzzle-selection.module#PuzzleSelectionModule'},
    // TODO: remove the :size param as we're not using it (app update needed first - think about using virtual links in the future)
    {path: routeToken.create + '/:size', loadChildren: './components/create-puzzle/create-puzzle.module#CreatePuzzleModule' },
    {path: routeToken.create, loadChildren: './components/create-puzzle/create-puzzle.module#CreatePuzzleModule' },
    {path: routeToken.wildcard, component: PageNotFoundComponent}
  ]}
];

export const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

export const microssPuzzleSize = new Map([
  [PuzzleSizeType._5x5, {name: 'Easy', id: '5x5', type: PuzzleSizeType._5x5, r: 5, c: 5}],
  [PuzzleSizeType._10x10, {name: 'Medium', id: '10x10', type: PuzzleSizeType._10x10 , r: 10, c: 10}],
  [PuzzleSizeType._15x15, {name: 'Hard', id: '15x15', type: PuzzleSizeType._15x15, r: 15, c: 15}]
]);
