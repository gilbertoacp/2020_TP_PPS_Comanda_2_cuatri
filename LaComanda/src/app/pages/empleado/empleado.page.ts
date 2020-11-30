import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Empleado } from '../../models/empleado';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEmpleado } from 'src/app/models/tipo-empleado.enum';
import { HacerPedidoComponent } from '../../components/hacer-pedido/hacer-pedido.component';
import { ListaDeEsperaMetreClienteComponent } from './lista-de-espera-metre-cliente/lista-de-espera-metre-cliente.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';

import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
})
export class EmpleadoPage implements OnInit, OnDestroy {

  empleado: Empleado;
  subscription: Subscription[] = [];

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private clientesService : ClientesService,
    private localNotifications: LocalNotifications,

  ) { }
  
  ngOnInit() {

    this.subscription.push(this.authService.getCurrentUserData(PerfilUsuario.EMPLEADO).subscribe(emp => {
      if(emp) (this.empleado = emp[0]);
      console.log(this.empleado);
      if(this.esMozoOMetre)
      {
        this.clientesService.clientesEnListaDeEspera().pipe(
          distinctUntilChanged((prev: Cliente[], curr: Cliente[]) =>  {
            return prev && prev.length > curr.length
          })
        ).subscribe(clientes => {
          if(clientes.length > 0) {
            this.localNotifications.schedule({
              title: 'Clientes en lista de espera!.',
              text: 'Hay nuevos clientes en la lista de espera.',
              icon: 'https://firebasestorage.googleapis.com/v0/b/clinicaonline-4cda1.appspot.com/o/assets%2Ficon2.png?alt=media&token=9ac298af-17a7-4d9f-bba0-bf2e53f9043e',
              trigger: { in: 0.5, unit: ELocalNotificationTriggerUnit.SECOND }
            });
          }
        })
      }

    }));

  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }

  irALaEncuesta(empleado: Empleado): void {
    this.router.navigate(['encuesta-empleado'], {
      state: {empleado},
      relativeTo: this.route
    });
  }

  esBartenderOCocinero(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.BARTENDER || empleado.tipo == TipoEmpleado.COCINERO;
  }

  esMozoOMetre(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.METRE || empleado.tipo == TipoEmpleado.MOZO;
  }

  esMetre(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.METRE;
  }

  esMozo(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.MOZO;
  }

  esBartender(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.BARTENDER;
  }

  esCocinero(empleado: Empleado): boolean {
    return empleado.tipo == TipoEmpleado.COCINERO;
  }

  IrAgregarProducto(empleado: Empleado): void {
    this.router.navigate(['alta-producto'], {
      state: {empleado},
      relativeTo: this.route
    });
  }

  async irAlaListaDeEspera(): Promise<void> {
    const m = await this.modalCtrl.create({
      component: ListaDeEsperaMetreClienteComponent,
    });

    m.present();
  }

  async hacerPedido(): Promise<void> {
    const m = await this.modalCtrl.create({
      component: HacerPedidoComponent,
      componentProps: {
        empleado: this.empleado,
        cliente: null
      }
    });

    m.present();
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
