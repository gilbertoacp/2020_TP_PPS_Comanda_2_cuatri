import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';
import { PerfilUsuario } from '../models/perfil-usuario.enum';
import { User } from 'firebase';
import { Cliente } from '../models/cliente';
import { Duenio } from '../models/duenio';
import { Empleado } from '../models/empleado';
import { ClienteAnonimo } from '../models/clienteAnonimo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<Usuario>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private http: HttpClient
  ) { 

    // se usa para los guards 
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          let doc: AngularFirestoreDocument = null;

          if(user.isAnonymous) {
            doc = this.db.doc<Cliente>('clientesAnonimos/' + user.uid);
          } else {
            doc = this.db.doc<Usuario>('usuarios/' + user.uid);
          }

          return doc.snapshotChanges().pipe(map(actions => {
            const obj: Usuario = {
              docId: user.uid,
              ...(actions.payload.data() as Usuario)
            }
            return obj;
          }));
        }
        return of(null);
      })
    );

  }

  login(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(correo, clave);
  }

  register(correo: string, clave: string): Promise<firebase.auth.UserCredential> {
    return this.auth.createUserWithEmailAndPassword(correo, clave);
  }

  loginAnonymously(): Promise<firebase.auth.UserCredential> {
    return this.auth.signInAnonymously();
  }

  getCurrentUser(): Observable<firebase.User> {
    return this.auth.authState.pipe(first());
  }

  getCurrentUserData(tipoUsuario: PerfilUsuario): Observable<any> {
    return this.auth.authState.pipe(
      switchMap((user: User) => {
        if(user) {

          if(tipoUsuario === PerfilUsuario.CLIENTE) {

            if(user.isAnonymous) {

              return this.db.doc<ClienteAnonimo>('clientesAnonimos/' + user.uid).snapshotChanges().pipe(map(actions => {
                const obj: ClienteAnonimo = {
                  docId: user.uid,
                  ...(actions.payload.data() as ClienteAnonimo)
                }
                return obj;
              }));

            } else  {

              return this.db.collection<Cliente>('clientes',
                ref => ref.where('authId', '==', user.uid)
              ).valueChanges({idField: 'docId'});

            }

          }

          if(tipoUsuario === PerfilUsuario.DUENIO) {
            return this.db.collection<Duenio>('duenios',
              ref => ref.where('authId', '==', user.uid)
            ).valueChanges({idField: 'docId'});
          }

          if(tipoUsuario === PerfilUsuario.EMPLEADO) {
            return this.db.collection<Empleado>('empleados',
              ref => ref.where('authId', '==', user.uid)
            ).valueChanges({idField: 'docId'});
          }

          if(tipoUsuario === PerfilUsuario.SUPERVISOR) {
            return this.db.collection('supervisores',
              ref => ref.where('authId', '==', user.uid)
            ).valueChanges({idField: 'docId'});
          }

        }
        return of(null);
      })
    )
  }

  registerWhithoutPersistance(correo: string, clave: string) {
    return this.http.post(environment.authRegister,{correo, clave}).toPromise();
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
    }catch (err) {
      console.log(err);
    }
    this.router.navigate(['/login']);
  }
}
