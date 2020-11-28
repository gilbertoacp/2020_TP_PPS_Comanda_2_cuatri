import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { ClienteAnonimo } from 'src/app/models/clienteAnonimo';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {

  cliente: Cliente | ClienteAnonimo;
  private subscription: Subscription;

  constructor(
    private authService : AuthService
  ) { }


  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
      if(Array.isArray(cliente)) {
        /** Cliente normal */
        this.cliente = cliente[0];
      } else {
        /** CLiente anónimo */
        this.cliente = cliente;
      }
      console.log(this.cliente);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('On destroy');
    
  }

  salir(){
    this.authService.logout();
  }

}
