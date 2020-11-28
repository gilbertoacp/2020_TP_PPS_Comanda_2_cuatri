import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { Mesa } from '../models/mesa';
import { EstadosMesa } from '../models/estado-mesa.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private db:AngularFirestore) { }

  obtenerFoto(mesa: Mesa) {
    let foto = '../../assets/defaultFotoMesa.jpg';
    if (mesa.foto) {
      foto = 'data:image/jpeg;base64,' + mesa.foto;
    }
    return foto;
  }

  mostrarFoto(fotoBase64: string) {
    let foto = '../../assets/defaultFotoMesa.jpg';
    if (fotoBase64 !== '') {
      foto = 'data:image/jpeg;base64,' + fotoBase64;
    }
    return foto;
  }


  getMesas(){
    return this.db.collection("mesas").valueChanges();
  }

  getMesa(id: string){
    return this.db.collection("mesas").doc(id).get();
  }


  crearMesa(mesa: Mesa) {
    mesa.fechaAlta = new Date();
    return this.db.collection<Mesa>('mesas').add(mesa);
  }

  getMesasLibre():Observable<Mesa[]>
  {
    return this.db.collection<Mesa>("mesas", ref => ref.where("estado", "==", EstadosMesa.LIBRE)).valueChanges({idField: 'id'});
  }

  getMesasAsignadas():Observable<Mesa[]>
  {
    return this.db.collection<Mesa>("mesas", ref => ref.where("estado", "==", EstadosMesa.ASIGNADA)).valueChanges({idField: 'id'});
  }

  actualizarMesa(id)
  {
    return this.db.collection("mesas").doc(id).update({estado: true});
  }

  borrarMesa(id){
    return this.db.collection("mesas").doc(id).delete();
  }

  cambiarEstadoDeLaMesa(mesa: Mesa, aceptado: boolean): void {
  
    this.db.collection<Mesa>('mesas')
    .doc(mesa.id)
    .set({estado: aceptado? EstadosMesa.LIBRE: EstadosMesa.ASIGNADA}, {merge: true})
  }
}
