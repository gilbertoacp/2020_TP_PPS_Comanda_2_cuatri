import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  
  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(map(user => {
      if (user)  return true;

      this.router.navigate(['/login']);
      return false;
    }));
  }
  
}
