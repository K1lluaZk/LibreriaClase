import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO(Fase Dashboard-frontend): reemplazar este placeholder por el panel
// real con métricas (HU-005), consumiendo GET /api/dashboard.
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1 class="h4 mb-3">Inicio</h1>
    <p class="text-muted">
      El dashboard con las métricas de la biblioteca se arma en una próxima fase.
    </p>
    <a routerLink="/libros" class="btn btn-primary btn-sm">Ir a Libros</a>
  `,
})
export class InicioComponent {}
