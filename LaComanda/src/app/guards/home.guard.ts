import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerfilUsuario } from '../models/perfil-usuario.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => {

      if(!user) return false;

      switch(user.perfil) {
        case PerfilUsuario.CLIENTE:
          this.router.navigate(['home/cliente']);
        break;

        case PerfilUsuario.DUENIO:
          this.router.navigate(['home/duenio']);
        break;

        case PerfilUsuario.EMPLEADO:
          this.router.navigate(['home/empleado']);
        break;
    
        case PerfilUsuario.SUPERVISOR:
          this.router.navigate(['home/supervisor']);
        break;
      }

      return true;
    }));
  } 
  
}
