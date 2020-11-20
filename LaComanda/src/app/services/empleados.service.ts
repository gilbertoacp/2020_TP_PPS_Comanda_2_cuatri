import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  constructor(private db: AngularFirestore) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.db.collection<Empleado>('empleados').valueChanges({idField: 'docId'});
  }

  agregarEmpleado(empleado: Empleado): void {
    this.db.collection<Empleado>('empleados').add(empleado);
  }

  agregarEncuesta(encuesta: any) {
    return this.db.collection<Empleado>('empleados').doc(encuesta.docIdEmpleado).set({
      encuestas: firestore.FieldValue.arrayUnion(encuesta)
    }, {merge: true});
  }
}
