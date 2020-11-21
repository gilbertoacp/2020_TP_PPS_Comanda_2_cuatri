import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private db: AngularFirestore) { }

  get productos(): Observable<Producto[]> {
    return this.db.collection<Producto>('productos').valueChanges();
  }

  agregarProducto(producto: Producto): Promise<DocumentReference> {
    return this.db.collection<Producto>('productos').add(producto);
  }
}
