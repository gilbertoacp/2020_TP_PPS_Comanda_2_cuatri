export interface Producto {
  docId?: string,
  nombre: string
  descripcion: string,
  tiempoElaboracion: string,
  precio: string,
  fotos: any,
  id: string,
  tipoProducto: 'plato' | 'bebida'
}
