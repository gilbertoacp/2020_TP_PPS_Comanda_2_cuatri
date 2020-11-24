import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private db:AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {
    this.getClientes().subscribe(data => this.registrados = data);
  }

  registrados = new Array();

  getClientes(){
    return this.db.collection("clientes").valueChanges();
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
    return this.db.collection<Cliente>("clientes", ref => ref.where("estado", "==", false)).valueChanges({idField: 'docId'});
  }

  correoRepetidoFB(mail: string): boolean{
    let existe = false;
    this.registrados.forEach(c => {
      if(c.correo == mail && !c.estado){
        existe = true;
      }
    });
    return existe;
  }

  correoRepetidoAFS(correo: string){
    let existe = false;
    this.registrados.forEach(c => {
      if(c.correo == correo && c.estado){
        existe = true;
      }
    });
    return existe;
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
    .set({estado: true}, {merge: true})
    .then(() => this.enviarCorreo(correo));
  }

  enviarCorreo(correo: any): void {
    this.http.post('https://us-central1-lacomanda-4960e.cloudfunctions.net/api', correo)
    .subscribe(console.log, console.log, console.log);
  }
}
