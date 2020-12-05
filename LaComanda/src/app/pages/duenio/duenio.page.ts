import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Duenio } from '../../models/duenio';
import { Cliente } from 'src/app/models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-duenio',
  templateUrl: './duenio.page.html',
  styleUrls: ['./duenio.page.scss'],
})
export class DuenioPage implements OnInit, OnDestroy {

  duenio: Duenio;
  clientesEnEspera: Cliente[];
  subscriptions: Subscription[] = [];

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
    private clientesService: ClientesService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.DUENIO).subscribe(duenio => {
        if(duenio) this.duenio = duenio[0];
      }),
      this.clientesService.clienteSinAprobar().pipe(
        distinctUntilChanged((prev: Cliente[], curr: Cliente[]) =>  {
          return prev && prev.length > curr.length
        })
      ).subscribe(clientes => {
        if(clientes.length > 0) {
          this.notificacionesService.push(
            'Clientes en espera!',
            'Hay nuevos clientes en la lista de espera.',
            'https://bit.ly/2HSh7nm',
          );
        }
      }),
      this.clientesService.clientesConReserva().pipe(
        distinctUntilChanged((prev: Cliente[], curr: Cliente[]) =>  {
          return prev && prev.length > curr.length
        })
      ).subscribe(clientes => {
        if(clientes.length > 0) {
          this.notificacionesService.push(
            'Clientes con reserva en espera!',
            'Hay clientes esperando la confirmación de su reserva.',
            'https://bit.ly/2HSh7nm',
          );
        }
      })
    );
  }

  ngOnDestroy() {
    console.log('on destroy');
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  recibir_info(info:any){
    alert(info);
  }
  
  recibir_foto(foto:any){
    alert(foto);
  }

  presentActionSheet(): void {
    this.actionSheetCtlr.create({
      buttons: [{
        text: 'Cerrar sesión',
        icon: 'log-out',
        handler: () => {
          this.authService.logout();
        }
      }]
    })
    .then(a => a.present());
  }
}
