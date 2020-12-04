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
import { distinctUntilChanged, first, ignoreElements, skip, take } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ListaTareasComponent } from 'src/app/components/empleado/lista-tareas/lista-tareas.component';

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
    private notificacionesService: NotificacionesService,
    private mesasService: MesaService,
    private pedidosService: PedidosService
  ) { }
  
  async ngOnInit(): Promise<void> {
    const subject = new Subject<string>();

    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.EMPLEADO).subscribe(emp => {
        if(emp) {
          this.empleado = emp[0]
          console.log(this.empleado);
          
          if(this.esMetre(this.empleado)) {
            subject.next('metre');
          }

          if(this.esMozo(this.empleado)) {
            subject.next('mozo');
          }

          if(this.esBartender(this.empleado)) {
            subject.next('bartender');
          }

          if(this.esCocinero(this.empleado)) {
            subject.next('cocinero');
          }
        }
        console.log(this.empleado);
      })
    );

    try {
      
      const info = await subject.asObservable().pipe(first()).toPromise();

      if(info === 'metre') {
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
        );
      }

      if(info === 'mozo') {
        this.subscriptions.push(
          this.mesasService.getChatsMesas()
          .pipe(skip(1))
          .subscribe(() => {
            this.notificacionesService.push(
              'Hay un nuevo mensaje!.',
              'hay clientes con dudas, no tardes en responder!',
              'https://bit.ly/3qoTVPa',
            );
          }),
          this.pedidosService.tareasCompletadas
          .pipe(
            distinctUntilChanged((prev, curr) => {
              return prev && prev.length > curr.length;
            })
          )
          .subscribe(() => {
            this.notificacionesService.push(
              'Hay un pedido listo!.',
              'hay un pedido listo para entregar, buscalo!!',
              'https://bit.ly/37C5fPc',
            );
          })
        );
      }

      if(info === 'bartender') {
        this.subscriptions.push(
          this.pedidosService.tareas.pipe(
            distinctUntilChanged((prev, curr) => {
              return prev && prev.length > curr.length;
            })
          )
          .subscribe(() => {
            this.notificacionesService.push(
              'Tenes nuevas tareas!.',
              'hay clientes esperando por sus bebidas!!',
              'https://bit.ly/3ggKvAv',
            );
          })
        );
      }

      if(info === 'cocinero') {
        this.subscriptions.push(
          this.pedidosService.tareas.pipe(
            distinctUntilChanged((prev, curr) => {
              return prev && prev.length > curr.length;
            })
          )
          .subscribe(() => {
            this.notificacionesService.push(
              'Tenes nuevas tareas!.',
              'hay clientes esperando por sus platos!!',
              'https://bit.ly/37C5fPc',
            );
          })
        );
      }
      
    } catch(err) {
      console.log(err);
    }
  }

  ngOnDestroy(): void {
    // debug
    console.log('on destroy');
    // debug
    console.log(this.subscriptions.length);
    
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

  verChats(): void  {
    this.router.navigate(['consultas-clientes'], {
      state: {
        mozo: this.empleado
      },
      relativeTo: this.route
    })
  }

  async verListaTareas(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ListaTareasComponent,
      componentProps:{
        tipo: this.empleado.tipo == TipoEmpleado.BARTENDER? 'bartender': 'cocinero'
      }
    });

    modal.present();
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
