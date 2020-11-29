import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Duenio } from '../../models/duenio';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { Cliente } from 'src/app/models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { distinctUntilChanged, distinctUntilKeyChanged, first, last, map } from 'rxjs/operators';


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
    private localNotifications: LocalNotifications,
    private clientesService: ClientesService,
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
          this.localNotifications.schedule({
            title: 'Clientes en espera!.',
            text: 'hay nuevos clientes en la lista de espera.',
            icon: 'https://firebasestorage.googleapis.com/v0/b/clinicaonline-4cda1.appspot.com/o/assets%2Ficon2.png?alt=media&token=9ac298af-17a7-4d9f-bba0-bf2e53f9043e',
            trigger: { in: 0.5, unit: ELocalNotificationTriggerUnit.SECOND }
          });
        }
      })
    );
  }

  ngOnDestroy() {
    console.log('On destroy');
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
