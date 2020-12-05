import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConsultaMozoComponent } from 'src/app/components/consulta-mozo/consulta-mozo.component';
import { HacerPedidoComponent } from 'src/app/components/hacer-pedido/hacer-pedido.component';
import { SolicitarCuentaComponent } from 'src/app/components/solicitar-cuenta/solicitar-cuenta.component';
import { Cliente } from 'src/app/models/cliente';
import { EstadoPedido } from 'src/app/models/estadoPedido.enum';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { MesaService } from 'src/app/services/mesa.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  subscriptions: Subscription[] = [];
  cliente: Cliente;
  mesa: Mesa;
  pedido: Pedido;

  mostrarPedido = false;

  constructor(
    private mesasService: MesaService,
    public authService: AuthService,
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private notificacionesService: NotificacionesService,
    private pedidosService: PedidosService
  ) { }

  async ngOnInit(): Promise<void> {

    const subject = new Subject<void>();
    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
        if(cliente) {
          this.cliente = cliente[0];
          subject.next();
        }
      })
    );

    try {
      await subject.asObservable().pipe(take(1)).toPromise();

      this.subscriptions.push(
        this.mesasService.traerMesaCliente(this.cliente).subscribe(mesa => {
          if(mesa) {
            console.log(mesa);
            
            this.mesa = mesa[0];
            this.actualizarEstadoPedido()
          }
        }),
      );

    } catch(err) {

      throw err;
    }
  }

  async actualizarEstadoPedido(): Promise<void> {
    this.pedido = (await this.pedidosService.traerPedidosMesa(this.mesa))[0];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async pedirProductos(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: HacerPedidoComponent,
      componentProps:  {
        cliente: this.cliente,
        mesa: this.mesa
      }
    });

    modal.present();
  }

  async consultaAlMozo(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ConsultaMozoComponent,
      componentProps:  {
        cliente: this.cliente,
        mesa: this.mesa
      }
    });

    modal.present();
  }

  async pedirCuenta(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SolicitarCuentaComponent,
      componentProps:  {
        cliente: this.cliente,
        mesa: this.mesa,
        pedido: this.pedido
      }
    });

    modal.present();

    modal.onDidDismiss().then(data => {
      if(data.data === 'pagando') {
        this.actualizarEstadoPedido();
      }
    });
  }

  async actualizarEstadoMesa(): Promise<void> {

    try {
      const result: BarcodeScanResult = await this.barcodeScanner.scan({formats: 'QR_CODE'});

      if(result.text === this.mesa.qr) {

        if(!this.pedido) {
          this.mostrarPedido = true;
        } else {
          this.actualizarEstadoPedido();
        }
      }
      else {
        this.notificacionesService.error();
        this.notificacionesService.toast(
          'No ha escaneado su mesa!', 
          'top',
          2500, 
          'warning'
        );
      }
    } catch(err) {
      this.notificacionesService.toast(err.message, 'top', 3000, 'danger');
    }

  }

  confirmarRecepcion() {
    this.pedidosService.confirmarRecepcionPedido(this.pedido.docId);
  }
}
