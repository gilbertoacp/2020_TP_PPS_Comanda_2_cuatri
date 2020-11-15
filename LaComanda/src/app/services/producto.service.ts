import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private db: AngularFirestore) { }

  agregarProducto(producto: Producto): void {
    this.db.collection<Producto>('productos').add(producto);
  }
}
