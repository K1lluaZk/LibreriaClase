import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../interfaces/usuario.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  // Uso opcional: { path: 'admin', data: { roles: ['ADMINISTRADOR'] } }
  const rolesPermitidos = route.data['roles'] as Rol[] | undefined;
  if (rolesPermitidos && !rolesPermitidos.includes(authService.rol() as Rol)) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
