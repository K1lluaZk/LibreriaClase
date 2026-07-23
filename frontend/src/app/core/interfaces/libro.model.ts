export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  isbn?: string | null;
  anio?: number | null;
  categoria: string;
  cantidadDisponible: number;
}

export type LibroFormData = Omit<Libro, 'id'>;

export interface FiltrosLibros {
  buscar?: string;
  categoria?: string;
}
