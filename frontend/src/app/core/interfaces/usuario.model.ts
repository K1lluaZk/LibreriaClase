export type Rol = 'ADMINISTRADOR' | 'BIBLIOTECARIO';

// Representa tanto a un socio (rol = null) como a un miembro del staff.
export interface Usuario {
  id: number;
  nombre: string;
  matricula: string;
  correo: string;
  telefono: string;
  rol: Rol | null;
  activo: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
