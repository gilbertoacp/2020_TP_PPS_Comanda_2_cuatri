
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { EstadoPedido } from '../models/estadoPedido.enum';
import { Pedido } from '../models/pedido';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private firebaseService :FirebaseService,
    private db: AngularFirestore) { }

  obtenerPedidos() {
    return this.firebaseService.getDocs('pedidos').pipe(
      map(pedido => {
        return pedido.map(a => {
          const data = a.payload.doc.data() as Pedido;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // Obtiene los pedidos pendientes
  obtenerPedidosPendientes() {
    return this.firebaseService.getDocs('pedidos').pipe(
      map(pedido => {
        return pedido.filter((p) => (p.payload.doc.data() as Pedido).estado === EstadoPedido.PENDIENTE)
          .map(a => {
            const data = a.payload.doc.data() as Pedido;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
      })
    );
  }


  // Obtiene los pedidos confirmados
  obtenerPedidosConfirmados() {
    return this.firebaseService.getDocs('pedidos').pipe(
      map(pedido => {
        return pedido.filter((p) => (p.payload.doc.data() as Pedido).estado === EstadoPedido.CONFIRMADO)
          .map(a => {
            const data = a.payload.doc.data() as Pedido;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
      })
    );
  }

  // Obtiene los pedidos activos por cliente
  obtenerPedidosActivos(cliente: Cliente) {

    //return this.db.collection<Pedido>("pedidos", ref => ref.where("usuario.id", "==", cliente.docId)).valueChanges({idField: 'id'});

    //Tenía esto hecho y me tiraba error a la hora de traer los pedidos activos, osea los pedidos sin terminar)
    return this.firebaseService.getDocQuery('pedidos', 'usuario.id', true, cliente.docId).pipe(
      map(pedido => {
        return pedido.filter((p) => (p.payload.doc.data() as Pedido).estado !== EstadoPedido.TERMINADO)
          .map(a => {
            const data = a.payload.doc.data() as Pedido;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
      })
    );
  }

  // Obtiene los pedidos finalizados por cliente
  obtenerPedidosFinalizados(cliente: Cliente) {
    return this.firebaseService.getDocQuery('pedidos', 'usuario.id', true, cliente.docId).pipe(
      map(pedido => {
        return pedido.filter((p) => (p.payload.doc.data() as Pedido).estado === EstadoPedido.TERMINADO)
          .map(a => {
            const data = a.payload.doc.data() as Pedido;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
      })
    );
  }

    // Obtiene los pedidos por cobrar
    obtenerPedidosPorCobrar() {
      return this.firebaseService.getDocs('pedidos').pipe(
        map(pedido => {
          return pedido.filter((p) => (p.payload.doc.data() as Pedido).estado === EstadoPedido.PAGANDO)
            .map(a => {
              const data = a.payload.doc.data() as Pedido;
              const id = a.payload.doc.id;
              return { id, ...data };
            });
        })
      );
    }

  // Obtener Pedido por id (id)
  obtenerPedido(uid: string) {
    return this.firebaseService.getDoc('pedidos', uid).pipe(
      map((pedido: any) => {
        const data = pedido.payload.data() as Pedido;
        const id = uid;
        return { id, ...data };
      })
    );
  }

  GetPedidoActivo(): Observable<Cliente[]> {
    return this.db.collection<Cliente>("clientes", 
      ref => ref.where("estado", "==", 'enEspera')
    )
    .valueChanges({idField: 'docId'});
  }

  // Crear pedido (Class Pedido)
  crearPedido(pedido: Pedido) {
    pedido.fechaAlta = new Date();
    return this.db.collection<Pedido>('pedidos').add(pedido);
  }

  // Actualizar pedidos (Class pedido)
  actualizarPedido(pedido: Pedido) {
    pedido.fechaModificado = new Date();

    //Le saco al pedido las imágenes para agregárselas posteriormente.
    pedido.productos.forEach(element => {
      element.fotos = null;

      element.producto.fotos = null;
    });

    return this.firebaseService.updateDoc('pedidos', pedido.id, Object.assign({}, pedido)).catch(
      (e)=>{
        alert("Error al subir archivo:"+JSON.stringify(e));
    });
  }

  // Borrar Pedido (id)
  borrarPedido(pedido: Pedido) {
    pedido.fechaBaja = new Date();
    return this.firebaseService.updateDoc('pedidos', pedido.id, Object.assign({}, pedido));
  }
}
