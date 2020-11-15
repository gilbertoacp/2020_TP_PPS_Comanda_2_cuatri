import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private db:AngularFirestore,
    private storage: AngularFireStorage) 
  {
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

  clienteSinAprobar(){
    return this.db.collection("clientes", ref => ref.where("estado", "==", false)).valueChanges();
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



}
