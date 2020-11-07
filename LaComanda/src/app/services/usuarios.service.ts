import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private db: AngularFirestore) { }

  agregarUsuarioConAuthId(docId: string, data: Usuario): void {
    this.db.collection('usuarios').doc(docId).set(data);
  }
}
