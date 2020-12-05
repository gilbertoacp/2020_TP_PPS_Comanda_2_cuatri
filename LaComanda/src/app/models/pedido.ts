import { Producto } from './producto';
import { EstadoPedido } from './estadoPedido.enum';

export interface Pedido {
  docId?: string
  productos?: Producto[]
  descuento?: number
  estado?: EstadoPedido
  numeroMesa?: number,
  codigo?: string,
  docIdMesa?: string,
  docIdCliente?: string
}   