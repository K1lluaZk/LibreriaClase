import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FiltrosLibros, Libro, LibroFormData } from '../interfaces/libro.model';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private readonly baseUrl = `${environment.apiUrl}/libros`;

  constructor(private http: HttpClient) {}

  getAll(filtros: FiltrosLibros = {}): Observable<Libro[]> {
    let params = new HttpParams();
    if (filtros.buscar) params = params.set('buscar', filtros.buscar);
    if (filtros.categoria) params = params.set('categoria', filtros.categoria);

    return this.http.get<Libro[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.baseUrl}/${id}`);
  }

  create(datos: LibroFormData): Observable<Libro> {
    return this.http.post<Libro>(this.baseUrl, datos);
  }

  update(id: number, datos: LibroFormData): Observable<Libro> {
    return this.http.put<Libro>(`${this.baseUrl}/${id}`, datos);
  }

  remove(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }
}
