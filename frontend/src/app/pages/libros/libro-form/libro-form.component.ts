import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroService } from '../../../core/services/libro.service';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libro-form.component.html',
})
export class LibroFormComponent implements OnInit {
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  private libroId: number | null = null;
  readonly esEdicion = signal(false);

  readonly formulario = this.fb.group({
    titulo: ['', [Validators.required]],
    autor: ['', [Validators.required]],
    isbn: [''],
    anio: [null as number | null],
    categoria: ['', [Validators.required]],
    cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  get f() {
    return this.formulario.controls;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.libroId = Number(idParam);
    this.esEdicion.set(true);
    this.cargando.set(true);

    this.libroService.getById(this.libroId).subscribe({
      next: (libro) => {
        this.formulario.patchValue(libro);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('No se pudo cargar el libro');
        this.cargando.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorMensaje.set(null);

    const datos = this.formulario.getRawValue();
    const peticion = this.esEdicion()
      ? this.libroService.update(this.libroId!, datos as any)
      : this.libroService.create(datos as any);

    peticion.subscribe({
      next: () => this.router.navigate(['/libros']),
      error: (err) => {
        this.guardando.set(false);
        this.errorMensaje.set(err.error?.error || 'No se pudo guardar el libro');
      },
    });
  }
}
