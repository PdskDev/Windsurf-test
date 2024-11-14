import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'images',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/images/image-list/image-list.component').then(m => m.ImageListComponent)
      },
      {
        path: 'upload',
        loadComponent: () => import('./features/images/image-upload/image-upload.component').then(m => m.ImageUploadComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/images',
    pathMatch: 'full'
  }
];
