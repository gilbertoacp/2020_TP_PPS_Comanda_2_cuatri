import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';

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
}
