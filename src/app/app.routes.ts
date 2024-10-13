import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'game',
    loadComponent: () => import('./components/game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./components/ranking/ranking.component').then((m) => m.RankingComponent),
  },
];
