import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { ActionSheetController } from '@ionic/angular';
import { Supervisor } from '../../models/supervisor';
import { ClientesService } from 'src/app/services/clientes.service';
import { Cliente } from 'src/app/models/cliente';
import { distinctUntilChanged } from 'rxjs/operators';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit, OnDestroy {

  supervisor: Supervisor;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService, 
    private actionSheetCtlr:ActionSheetController,
    private clientesService: ClientesService,
    private localNotifications: LocalNotifications
  ) { }
  
  ngOnInit() {
    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.SUPERVISOR).subscribe((supervisor) => {
        if(supervisor) {
          this.supervisor = supervisor[0];
          console.log(this.supervisor);
        }
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
    ) 
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
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
