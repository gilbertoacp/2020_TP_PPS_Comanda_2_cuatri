import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {

  cliente: Cliente;
  pedidosActivos: any = [];
  private subscriptions: Subscription[] = [];
  esAnonimo: boolean= true;
  toastListaDeEspera: HTMLIonToastElement;
  disablePrevBtn;
  disableNextBtn

  slideOpts = {}

  constructor(
    private authService: AuthService,
    public barcodeScanner: BarcodeScanner,
    public vibration: Vibration,
    private toastCtlr: ToastController,
    private clienteService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private mesaService: MesaService,
    private notificacionesService: NotificacionesService
  ) { }


  ngOnInit() {
    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(async cliente => {
        if (cliente) {
          this.cliente = cliente[0];
          console.log(this.cliente);

          if(this.cliente.atendido === 'esperando') {
            this.mostrarToastListaDeEspera();
          } else {
            if(this.toastListaDeEspera)
              this.toastListaDeEspera.dismiss();

            if(this.cliente.atendido === 'enLaMesa') 
              this.irALaMesa();
          }
        } 
      })
    );
  }

  ngOnDestroy(): void {
    if(this.toastListaDeEspera) {
      this.toastListaDeEspera.dismiss();
    }

    // debug
    console.log('On destroy cliente'); 

    this.subscriptions.forEach(s => s.unsubscribe());
  }

  irALaMesa(): void {
    this.router.navigate(['mesa'], {relativeTo: this.route});
  }

  salir(): void{
    this.authService.logout();
  }

  irListaEspera(): void {
    this.router.navigate(["lista-espera"],
      {
        relativeTo: this.route
      });
  }

  irPedidoActivo(): void {
    this.router.navigate(["pedidos"],
      {
        relativeTo: this.route
      });
  }

  irReserva(): void {
    this.router.navigate(['reserva'], {
      relativeTo: this.route
    });
  }

  irFinalizados(): void {
    this.router.navigate(["finalizados"],
      {
        relativeTo: this.route
      });
  }

  
  async scanQR(): Promise<void> {
    try {
      const data = await this.barcodeScanner.scan({ formats: 'QR_CODE' });

      if (!data.cancelled && data.text === 'listaDeEspera' && this.cliente.atendido !== 'esperando') {
        this.clienteService.ponerEnListaDeEspera(this.cliente);
      } else {
        await this.mesaService.irALaMesa(data.text, this.cliente);
        this.irALaMesa();
      }

    } catch(err) {
      this.notificacionesService.error();
      this.notificacionesService.toast(err.message, 'top', 2000, 'danger');
    }
  }

  async mostrarToastListaDeEspera(): Promise<void> {
    this.toastListaDeEspera = await this.toastCtlr.create({
      position:'bottom',
      message: 'Se le va asignar una mesa pronto aguarde unos minutos.',
      mode: 'ios',
      color: 'warning',
    });
    this.toastListaDeEspera.present();
  }

  doCheck() {}

  navigationOptions() {}
}
