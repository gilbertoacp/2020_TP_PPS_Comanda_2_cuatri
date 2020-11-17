import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {

  cliente: Cliente;
  private subscription: Subscription;

  constructor(
    private authService : AuthService
  ) { }


  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE)
    .subscribe(cliente => {
      if(cliente) {
        this.cliente = cliente[0];
        console.log(this.cliente);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  salir(){
    this.authService.logout();
  }

}
