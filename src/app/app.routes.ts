import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Restaurants } from './features/restaurants/restaurants';
import { authGuard } from './core/auth-guard';
import { Layout } from './shared/layout/layout';
import { Register } from './features/register/register';
import { Menu } from './features/menu/menu';
import { Dish } from './features/dishes/dishes';

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
      {
        path: 'restaurants/:id',
        component: Menu,
      },
      {
        path: 'dishes/:id',
        component: Dish,
      },
    ],
  },
  {
    path: 'register',
    component: Register,
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
