import { PerfilUsuario } from './perfil-usuario.enum';

export interface Usuario {
  correo: string,
  clave: string,
  perfil: PerfilUsuario,
  docId?: string
}
