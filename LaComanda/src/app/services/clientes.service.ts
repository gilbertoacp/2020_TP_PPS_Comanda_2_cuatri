import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private db:AngularFirestore,
    private http: HttpClient
  ) {
    this.getClientes().subscribe(data => this.registrados = data);
  }

  registrados: Cliente[] = [];

  getClientes(): Observable<Cliente[]>{
    return this.db.collection<Cliente>("clientes").valueChanges();
  }

  getCliente(id: string){
    return this.db.collection("clientes").doc(id).get();
  }

  registrarCliente(cliente: Cliente){
    this.db.collection<Cliente>("clientes").add(cliente);
  }

  registroPendiente(){
    return this.db.collection("clientes", ref => ref.where("estado", "==", false)).stateChanges(["added"]);
  }

  clienteSinAprobar(): Observable<Cliente[]> {
    return this.db.collection<Cliente>("clientes", 
      ref => ref.where("estado", "==", 'enEspera')
    )
    .valueChanges({idField: 'docId'});
  }

  correoRepetidoFB(mail: string): boolean{
    let existe = false;
    this.registrados.forEach(c => {
      if(c.correo == mail && c.estado === 'aceptado'){
        existe = true;
      }
    });
    return existe;
  }

  clientesEnListaDeEspera():Observable<Cliente[]>
  {
    return this.db.collection<Cliente>("clientes", 
      ref => ref.where("atendido", "==", 'esperando')
    )
    .valueChanges({idField: 'docId'});
  }

  clientesAnonimosEnListaDeEspera():Observable<Cliente[]>
  {
    return this.db.collection<Cliente>("clientesAnonimos", 
      ref => ref.where("atendido", "==", 'esperando')
    )
    .valueChanges({idField: 'docId'});
  }


  actualizarRegistros(id)
  {
    return this.db.collection("clientes").doc(id).update({estado: true});
  }

  eliminarCliente(id){
    return this.db.collection("clientes").doc(id).delete();
  }

  /*
  * param: cliente: Cliente, desc: El cliente el cual se acepto o rechaza su accesso a la aplicación
  * param: aceptado: boolean, desc: Determina si fué aceptado o rechazado
  * return: void
  */
  cambiarEstadoDelRegistro(cliente: Cliente, aceptado: boolean): void {
    const correo = {
      to: cliente.correo,
      message: aceptado? 
        'Se ha aprobado su solicitud de ingreso a la aplicación, ya puede acceder a los servicios que le ofrece LaComanda App.':
        'Se ha rechazado su solicitud de ingreso a la aplicación, por favor contactese con el equipo de administración para analizar su situación.',
      subject: 'Estado del registro.'
    }
    
    this.db.collection<Cliente>('clientes')
    .doc(cliente.docId)
    .set({estado: aceptado? 'aceptado': 'rechazado'}, {merge: true})
    .then(() => this.enviarCorreo(correo));
  }

  cambiarEstadoDelCliente(cliente: Cliente, aceptado: boolean): void {
    
    this.db.collection<Cliente>('clientes')
    .doc(cliente.docId)
    .set({atendido: aceptado? 'enLaMesa': 'rechazado'}, {merge: true})
  }

  // cambiarEstadoDelClienteAnonimo(cliente: ClienteAnonimo, aceptado: boolean): void {
    
  //   this.db.collection<ClienteAnonimo>('clientesAnonimos')
  //   .doc(cliente.docId)
  //   .set({atendido: aceptado? 'enLaMesa': 'rechazado'}, {merge: true})
  // }

  // ponerEnListaDeEsperaAnonimo(cliente: ClienteAnonimo): void
  // {
  //   this.db.collection<ClienteAnonimo>('clientesAnonimos')
  //   .doc(cliente.docId)
  //   .set({atendido: 'esperando'}, {merge: true})
  // }

  ponerEnListaDeEspera(cliente: Cliente): void
  {
    this.db.collection<Cliente>('clientes')
    .doc(cliente.docId)
    .set({atendido: 'esperando'}, {merge: true})
  }

  ponerEnLaMesa(cliente: Cliente): void
  {
    this.db.collection<Cliente>('clientes')
    .doc(cliente.docId)
    .set({atendido: 'enLaMesa'}, {merge: true})
  }

  // ponerEnLaMesaAnonimo(cliente: ClienteAnonimo): void
  // {
  //   this.db.collection<ClienteAnonimo>('clientesAnonimos')
  //   .doc(cliente.docId)
  //   .set({atendido: 'enLaMesa'}, {merge: true})
  // }

  enviarCorreo(correo: any): void {
    this.http.post('https://us-central1-lacomanda-4960e.cloudfunctions.net/api', correo)
    .subscribe(console.log, console.log, console.log);
  }
}