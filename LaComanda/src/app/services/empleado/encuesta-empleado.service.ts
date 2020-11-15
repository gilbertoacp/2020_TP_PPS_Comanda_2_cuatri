import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EncuestaEmpleadoService {

  constructor(private db: AngularFirestore) { }

  agregarEncuesta(encuesta): Promise<DocumentReference> {
    return this.db.collection('encuestasEmpleados').add(encuesta);
  }
}
