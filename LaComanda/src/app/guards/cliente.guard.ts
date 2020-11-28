import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PerfilUsuario } from '../models/perfil-usuario.enum';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  canActivate(): Observable<boolean>{
    return this.authService.user$.pipe(map(user => {
      
      if(user.perfil === PerfilUsuario.CLIENTE || !user.perfil) return true;

      console.log('Acceso denegado no es cliente');
      // this.router.navigate(['/home']);
      return false;
    }));
  }
  
}
