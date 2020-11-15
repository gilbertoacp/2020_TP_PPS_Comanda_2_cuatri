import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(private db:AngularFirestore) { }

  getConsultas(){
    return this.db.collection("consultas").valueChanges();
  }

  getConsultasCliente(idcliente: string){
    return this.db.collection("consultas", ref => ref.where("idcliente", "==", idcliente)).valueChanges();
  }

  responderConsulta(idconsulta: string, respuesta: string){
    return this.db.collection("consultas").doc(idconsulta).update({respuesta: respuesta});
  }

  crearConsulta(mesa: string, cliente: string, nombreCliente:string, consulta: string){
    let fecha = Date.now();
    let idconsulta: string = fecha + "." + cliente;
    return this.db.collection("consultas").doc(idconsulta).set({
      idconsulta: idconsulta,
      mesa: mesa,
      idCliente: cliente,
      nombreCliente: nombreCliente,
      consulta: consulta,
      respuesta: "Esperando respuesta...",
      fecha: fecha,
      respondida: false
    });
  }

  
}
