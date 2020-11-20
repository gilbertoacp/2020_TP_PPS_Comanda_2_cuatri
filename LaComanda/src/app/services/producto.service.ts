import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private db: AngularFirestore) { }

  agregarProducto(producto: Producto): Promise<DocumentReference> {
    return this.db.collection<Producto>('productos').add(producto);
  }
}
