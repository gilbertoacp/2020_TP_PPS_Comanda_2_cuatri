import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<Usuario>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) { 
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<Usuario>('usuarios/' + user.uid).snapshotChanges().pipe(map(actions => {
            const obj: Usuario = {
              docId: user.uid,
              ...actions.payload.data() 
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

  getCurrentUser(): Observable<firebase.User> {
    return this.auth.authState.pipe(first());
  }

  logout(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
