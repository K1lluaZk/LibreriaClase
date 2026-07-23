import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../interfaces/usuario.model';

const TOKEN_KEY = 'libreria_token';
const USUARIO_KEY = 'libreria_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal privado con el usuario actual; se inicializa desde localStorage
  // para mantener la sesión al recargar la página.
  private readonly _usuarioActual = signal<Usuario | null>(this.leerUsuarioGuardado());

  readonly usuarioActual = this._usuarioActual.asReadonly();
  readonly estaAutenticado = computed(() => this._usuarioActual() !== null);
  readonly rol = computed(() => this._usuarioActual()?.rol ?? null);

  constructor(private http: HttpClient) {}

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((respuesta) => this.guardarSesion(respuesta)),
    );
  }

  logout(): void {
    // Best-effort: el JWT es stateless, lo importante es limpiar el estado local.
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      error: () => {}, // aunque falle la llamada, igual cerramos sesión localmente
    });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this._usuarioActual.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private guardarSesion(respuesta: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, respuesta.token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
    this._usuarioActual.set(respuesta.usuario);
  }

  private leerUsuarioGuardado(): Usuario | null {
    const crudo = localStorage.getItem(USUARIO_KEY);
    if (!crudo) return null;
    try {
      return JSON.parse(crudo) as Usuario;
    } catch {
      return null;
    }
  }
}
