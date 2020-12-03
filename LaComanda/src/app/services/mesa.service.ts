import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mesa } from '../models/mesa';
import { EstadosMesa } from '../models/estado-mesa.enum';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { map, skip, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { Mensaje } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private db:AngularFirestore) { }

  getMesas() {
    return this.db.collection("mesas").valueChanges();
  }

  getMesa(docId: string){
    return this.db.collection<Mesa>("mesas").doc(docId).valueChanges();
  }

  getChatsMesas(): Observable<Array<Mensaje[]>> {
    return this.db.collection<Mesa>('mesas')
            .valueChanges({idField: 'docId'})
            .pipe(
              map(mesas => mesas.map(mesa =>  {
                if(!mesa.chat) {
                  return [{numeroMesa: mesa.numero}];
                }

                return mesa.chat;
              }))
            );
  }

  // getChatsMesasAsignadas() {
  //   return this.db.collection<Mesa>('mesas')
  //         .valueChanges({idField: 'docId'})
  //         .pipe(skip(1))
  //         .subscribe
  // }

  crearMesa(mesa: Mesa) {
    mesa.fechaAlta = new Date();
    return this.db.collection<Mesa>('mesas').add(mesa);
  }

  getMesasLibre(): Observable<Mesa[]>
  {
    return this.db.collection<Mesa>("mesas", ref => ref.where("estado", "==", EstadosMesa.LIBRE)).valueChanges({idField: 'docId'});
  }

  getMesasAsignadas(): Observable<Mesa[]>
  {
    return this.db.collection<Mesa>("mesas", ref => ref.where("estado", "==", EstadosMesa.ASIGNADA)).valueChanges({idField: 'docId'});
  }

  actualizarMesa(id)
  {
    return this.db.collection("mesas").doc(id).update({estado: true});
  }

  async asignarMesaACliente(docId: string, docIdCliente: string): Promise<void> {
    try {
      await this.db.collection<Mesa>('mesas')
      .doc(docId)
      .set({estado: EstadosMesa.ASIGNADA, docIdCliente}, {merge: true});
  
      await this.db.collection<Cliente>('clientes')
      .doc(docIdCliente)
      .set({atendido: 'enLaMesa'}, {merge: true});
    }
    catch(err) {
      throw Error(err.message);
    }
  }

  cambiarEstadoDeLaMesa(mesa: Mesa, aceptado: boolean): void {
  
    this.db.collection<Mesa>('mesas')
    .doc(mesa.id)
    .set({estado: aceptado? EstadosMesa.LIBRE: EstadosMesa.ASIGNADA}, {merge: true})
  }

  async irALaMesa(qrMesa: string, cliente: Cliente): Promise<void> {
    const mesa = await this.db.collection<Mesa>('mesas',
      ref => ref.where('qr', '==', qrMesa)
    )
    .valueChanges()
    .pipe(take(1))
    .toPromise();

    if(cliente.atendido !== 'enLaMesa') {
      throw Error('No se le ha asignado ninguna mesa aún.!');
    }

    if(mesa[0].docIdCliente !== cliente.docId) {
      throw Error('Ha escaneado la mesa incorrecta.!')
    }
  }

  traerMesaCliente(cliente: Cliente): Observable<Mesa[]> {
    return this.db.collection<Mesa>('mesas',
      ref => ref.where('docIdCliente', '==', cliente.docId)
    ).valueChanges({idField: 'docId'});
  }

  enviarConsulta(mesa:Mesa, mensaje: any): void {
    this.db.collection('mesas').doc(mesa.docId).set({
      chat: firestore.FieldValue.arrayUnion(mensaje)
    },{merge: true});
  }

  responderConsulta(docIdMesa: string, mensaje: any): void {
    this.db.collection('mesas').doc(docIdMesa).set({
      chat: firestore.FieldValue.arrayUnion(mensaje)
    },{merge: true});
  }

  chatMesa(docId: string): Observable<any[]>{
    return this.db.collection<Mesa>('mesas')
          .doc<Mesa>(docId)
          .valueChanges()
          .pipe(
            map(mesa => mesa.chat)
          );
  }
}