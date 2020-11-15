import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerfilUsuario } from '../models/perfil-usuario.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DuenioGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => {
    
      if(user.perfil === PerfilUsuario.DUENIO) return true;

      console.log('Acceso denegado no es duenio');
      // this.router.navigate(['/home']);
      return false;
    }));
  }
  
}
