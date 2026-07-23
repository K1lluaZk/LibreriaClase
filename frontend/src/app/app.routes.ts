import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent) },
      { path: 'libros', loadComponent: () => import('./pages/libros/libros-lista/libros-lista.component').then((m) => m.LibrosListaComponent) },
      { path: 'libros/nuevo', loadComponent: () => import('./pages/libros/libro-form/libro-form.component').then((m) => m.LibroFormComponent) },
      { path: 'libros/:id/editar', loadComponent: () => import('./pages/libros/libro-form/libro-form.component').then((m) => m.LibroFormComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
