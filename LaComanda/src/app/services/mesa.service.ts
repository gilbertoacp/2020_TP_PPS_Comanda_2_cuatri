import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private db:AngularFirestore) { }

  traerMesas(){
    return this.db.collection("mesas").valueChanges();
  }

  traerMesa(id: string){
    return this.db.collection("mesas").doc(id).get();
  }
}
