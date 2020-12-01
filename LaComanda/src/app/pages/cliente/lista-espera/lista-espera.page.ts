import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../models/cliente';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  cliente: Cliente;
  pedido = null;
  private subscription: Subscription;

  constructor(private authService: AuthService,
    public barcodeScanner: BarcodeScanner,
    public vibration: Vibration,
    private toastCtlr: ToastController,
    private pedidoService: PedidosService,
    private clienteService: ClientesService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit() {
      this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
        if (cliente) {
          this.cliente = cliente[0];
          this.obtenerEstado
        } 
        console.log(this.cliente);
      });
    }
  
    obtenerEstado() {
      this.pedidoService.obtenerPedidosActivos(this.cliente).subscribe(pedidos => {
          this.pedido = pedidos;
      });
    }
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
      console.log('On destroy');
    }
  
    irPedidoActivo(): void {
      this.router.navigate(["/home/cliente/pedidos"]);
    }
  
    escanearQR(): void {
      this.barcodeScanner.scan({ formats: 'QR_CODE' }).then((data) => {
        if (data && !data.cancelled) {
          if (this.pedido.length > 0 && data.text === this.pedido[0].mesa.qr) {
            // Si tiene pedidos activos y coincide con el codigo de qr de la mesa asignada lo llevamos al pedido
            this.irPedidoActivo();
          } else {
            // No existe QR o no es de la mesa asignada
            let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonERROR.mp3';
            audio.play();
            this.vibration.vibrate(2000);
  
            this.toastCtlr.create({
            message: 'Error, no es la mesa asignada',
            position: 'top',
            duration: 2000,
            color: 'danger',
  
          })
          }
        }
      }, (err) => this.toastCtlr.create({
        message: err,
        position: 'top',
        duration: 2000,
        color: 'danger',
      }));
    }

    atras(): void {
      this.router.navigate(["/home/cliente"]);
    }

}
