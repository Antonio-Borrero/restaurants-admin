import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Restaurants } from './features/restaurants/restaurants';
import { authGuard } from './core/auth-guard';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'restaurants',
        component: Restaurants,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
