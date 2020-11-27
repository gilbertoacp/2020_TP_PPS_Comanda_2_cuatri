import { TipoCliente } from './tipo-cliente.enum';

export interface Cliente {
  docId?: string,
  authId?: string,
  nombre: string,
  apellido: string,
  dni: number,
  correo: string,
  contraseña: string,
  foto: string,
  tipo: TipoCliente,
  estado : 'enEspera' | 'rechazado' | 'aceptado'
}
