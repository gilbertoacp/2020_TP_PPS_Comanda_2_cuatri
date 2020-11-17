import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private authService : AuthService
  ) { }


  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
      console.log(cliente[0]);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  salir(){
    this.authService.logout();
  }

}
