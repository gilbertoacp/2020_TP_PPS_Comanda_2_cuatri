import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private db: AngularFirestore) { }

  agregarUsuarioConAuthId(docId: string, data: Usuario): void {
    this.db.collection('usuarios').doc(docId).set(data);
  }

  getUser(userId):Observable<Usuario>{
    return this.db.collection('usuarios').doc<Usuario>(userId).valueChanges();   
  }
}
