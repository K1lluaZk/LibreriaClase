import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

// TODO(Fase Dashboard-frontend): reemplazar este placeholder por el panel
// real con métricas y navegación lateral (HU-005).
@Component({
  selector: 'app-inicio',
  standalone: true,
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h4 mb-0">Bienvenido/a, {{ authService.usuarioActual()?.nombre }}</h1>
        <button class="btn btn-outline-secondary btn-sm" (click)="cerrarSesion()">
          Cerrar sesión
        </button>
      </div>
      <p class="text-muted">
        El dashboard con las métricas de la biblioteca se arma en la próxima fase.
      </p>
    </div>
  `,
})
export class InicioComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
