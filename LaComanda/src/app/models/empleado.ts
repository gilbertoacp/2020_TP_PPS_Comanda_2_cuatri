import { TipoEmpleado } from './tipo-empleado.enum';

export interface Empleado {
  docId?: string,
  authId?: string,
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  foto: string;
  tipo: TipoEmpleado,
  correo: string,
}