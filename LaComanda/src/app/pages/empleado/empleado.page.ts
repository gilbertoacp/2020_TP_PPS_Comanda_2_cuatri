import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { Empleado } from '../../models/empleado';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEmpleado } from 'src/app/models/tipo-empleado.enum';
import { HacerPedidoComponent } from '../../components/hacer-pedido/hacer-pedido.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
})
export class EmpleadoPage implements OnInit, OnDestroy {

  empleado: Empleado;
  subscriptions: Subscription[] = [];

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private clientesService : ClientesService,
    private notificacionesService: NotificacionesService
  ) { }
  
  ngOnInit() {
    const metreSubject = new Subject<Empleado>();

    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.EMPLEADO).subscribe(emp => {
        if(emp) {
          this.empleado = emp[0]

          if(this.esMetre(this.empleado)) {
            metreSubject.next(this.empleado);
          }
        }
        console.log(this.empleado);
      })
    );

    metreSubject.asObservable().pipe(first()).toPromise().then(metre => {
      if(metre) {
        this.subscriptions.push(
          this.clientesService.clientesEnListaDeEspera().pipe(
            distinctUntilChanged((prev: Cliente[], curr: Cliente[]) =>  {
              return prev && prev.length > curr.length
            })
          ).subscribe(clientes => {
            if(clientes.length > 0) {
              this.notificacionesService.push(
                'Clientes en espera!.',
                'Hay nuevos clientes en espera de una mesa.',
                'https://bit.ly/39w7LJE',
              );
            }
          })
        )
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
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
