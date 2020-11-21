export interface Producto {
  docId?: string,
  nombre: string
  descripcion: string,
  tiempoElaboracion: string,
  precio: number,
  fotos: any,
  id: string,
  tipoProducto: 'plato' | 'bebida'
  cantidad? : number
}
