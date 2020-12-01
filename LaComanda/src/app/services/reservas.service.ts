import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IReserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private db:AngularFirestore) { }

  getReservas(){
    return this.db.collection<IReserva>("reservas").valueChanges();
  }

  crearReserva(reserva:IReserva){
    return this.db.collection("reservas").add(reserva);
  }
}
