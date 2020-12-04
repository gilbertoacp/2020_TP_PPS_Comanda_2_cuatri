import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EstadoPedido } from '../models/estadoPedido.enum';
import { Pedido } from '../models/pedido';
import { Producto } from '../models/producto';
import { Tarea } from '../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private pedidosCollection: AngularFirestoreCollection<Pedido>;
  private tareasCollection: AngularFirestoreCollection<Tarea>;

  constructor(private db: AngularFirestore) {
    this.pedidosCollection = this.db.collection<Pedido>('pedidos');
    this.tareasCollection = this.db.collection('tareas');
  }

  get pedidosPendientes(): Observable<Pedido[]> {
    return this.db.collection<Pedido>('pedidos', 
      ref => ref.where('estado', '==', EstadoPedido.PENDIENTE)
    )
    .valueChanges({idField: 'docId'});
  }

  get tareas(): Observable<Tarea[]> {
    return this.db.collection<Tarea>('tareas', 
            ref => ref.where('listoParaEntregar', '==', false)
          )
          .valueChanges({idField: 'docId'});
  }

  hacerPedido(pedido: Pedido): Promise<DocumentReference> {
    return this.pedidosCollection.add(pedido);
  }

  confirmarPedido(pedido: Pedido): Promise<void> {
    this.asignarTarea(pedido);

    return this.pedidosCollection.doc(pedido.docId).set({
      estado: EstadoPedido.CONFIRMADO
    }, {merge: true});
  }

  private asignarTarea(pedido: Pedido) {
    this.db.collection<Tarea>('tareas').add({
      codigo: pedido.codigo,
      listoParaEntregar: false,
      numeroMesa: pedido.numeroMesa,
      bebidas: pedido.productos.filter(p => p.tipoProducto === 'bebida')
                                .map(p => Object.assign({}, {completados: false, productos: p})),
      platos: pedido.productos.filter(p => p.tipoProducto === 'plato')
                                .map(p => Object.assign({}, {completados: false, productos: p}))
    });
  }

} 