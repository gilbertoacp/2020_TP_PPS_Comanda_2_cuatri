import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Duenio } from '../models/duenio';
import { Supervisor } from '../models/supervisor';

@Injectable({
  providedIn: 'root'
})
export class DuenioSupervisorService {

  constructor(private db:AngularFirestore) { }

  getSupervisores(): Observable<Supervisor[]> {
    return this.db.collection<Supervisor>('supervisores').valueChanges({idField: 'docId'});
  }

  agregarSupervisor(supervisor: Supervisor): void {
    this.db.collection<Supervisor>('supervisores').add(supervisor);
  }

  getDuenios(): Observable<Duenio[]> {
    return this.db.collection<Duenio>('duenios').valueChanges({idField: 'docId'});
  }

  agregarDuenio(duenio: Duenio): void {
    this.db.collection<Duenio>('duenios').add(duenio);
  }
}
