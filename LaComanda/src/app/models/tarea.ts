import { Producto } from './producto';

export interface Tarea {
  numeroMesa: number,
  productos?: any,
  listoParaEntregar: boolean,
  codigo: string,
  bebidas?: any,
  platos?: any,
  docId?: string,
  docIdPedido? : string
}
