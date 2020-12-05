import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { EstadoPedido } from '../models/estadoPedido.enum';
import { Mesa } from '../models/mesa';
import { Pedido } from '../models/pedido';
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

  get tareasCompletadas(): Observable<Tarea[]> {
    return this.db.collection<Tarea>('tareas', 
            ref => ref.where('listoParaEntregar', '==', true)
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

  pedidoListo(docId: string): Promise<void> {
    return this.pedidosCollection.doc(docId).set({
      estado: EstadoPedido.LISTO
    }, { merge: true });
  }

  entregarPedido(docId: string, docIdTarea: string): Promise<void> {
    this.eliminarTarea(docIdTarea);

    return this.pedidosCollection.doc(docId).set({
      estado: EstadoPedido.ENTREGADO
    }, { merge: true });
  }

  traerPedidosMesa(mesa: Mesa): Promise<Pedido[]> {
    return this.db.collection('pedidos',
      ref => ref.where('numeroMesa', '==', mesa.numero)
    )
    .valueChanges({idField: 'docId'})
    .pipe(
      first()
    )
    .toPromise();
  }

  completarTarea(tarea: Tarea): Promise<void> {
    return this.tareasCollection.doc(tarea.docId).set(tarea, {merge: true});
  }

  pagoCliente(docId: string, docIdMesa: string, docIdCliente: string) {
    return this.pedidosCollection.doc(docId).set({
      estado: EstadoPedido.PAGANDO,
      docIdMesa,
      docIdCliente
    }, { merge: true });
  }

  pagosAConfirmar(): Observable<Pedido[]> {
    return this.db.collection('pedidos', 
      ref => ref.where('estado', '==', EstadoPedido.PAGANDO)
    )
    .valueChanges({idField: 'docId'});
  }

  confirmarPago(docId: string): Promise<void> {
    return this.pedidosCollection.doc(docId).delete();
  }

  private asignarTarea(pedido: Pedido): void {
    this.db.collection<Tarea>('tareas').add({
      codigo: pedido.codigo,
      listoParaEntregar: false,
      numeroMesa: pedido.numeroMesa,
      bebidas: {
        completado: false,
        productos: pedido.productos.filter(p => p.tipoProducto === 'bebida')
      } ,
      platos: {
        completado: false,
        productos: pedido.productos.filter(p => p.tipoProducto === 'plato')
      },
      docIdPedido: pedido.docId
    });
  }

  private eliminarTarea(docId: string): Promise<void> {
    return this.tareasCollection.doc(docId).delete();
  }

} 