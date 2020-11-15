import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private db:AngularFirestore) { }

  getPedidoCliente(idcliente: string){
    return this.db.collection("pedidos", ref => ref.where('idCliente', "==", idcliente)).valueChanges();
  }

  cargarPedido(idC, mesa, productos){
    return new Promise((resolve, rejected) => {
        this.db.collection("pedidos").doc(idC).set({
          confirmado : false,
          descuento : 0,
          estado : "En preparación",
          idC : idC,
          mesa : mesa,
          productos : productos,
        }).catch(error => rejected(error));
    });
  }
}
