import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LibroService } from '../../../core/services/libro.service';
import { AuthService } from '../../../core/services/auth.service';
import { Libro } from '../../../core/interfaces/libro.model';

@Component({
  selector: 'app-libros-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libros-lista.component.html',
})
export class LibrosListaComponent implements OnInit {
  readonly libros = signal<Libro[]>([]);
  readonly cargando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  readonly buscarControl = new FormControl('');

  constructor(
    private libroService: LibroService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarLibros();

    this.buscarControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((texto) => this.cargarLibros(texto || ''));
  }

  cargarLibros(buscar: string = ''): void {
    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.libroService.getAll({ buscar }).subscribe({
      next: (libros) => {
        this.libros.set(libros);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('No se pudo cargar el listado de libros');
        this.cargando.set(false);
      },
    });
  }

  eliminar(libro: Libro): void {
    const confirmado = confirm(`¿Eliminar "${libro.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.libroService.remove(libro.id).subscribe({
      next: () => this.cargarLibros(this.buscarControl.value || ''),
      error: (err) => this.errorMensaje.set(err.error?.error || 'No se pudo eliminar el libro'),
    });
  }

  puedeEliminar(): boolean {
    return this.authService.rol() === 'ADMINISTRADOR';
  }
}
