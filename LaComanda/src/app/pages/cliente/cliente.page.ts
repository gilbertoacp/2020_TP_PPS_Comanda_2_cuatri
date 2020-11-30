import { Component, OnDestroy, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { ClienteAnonimo } from 'src/app/models/clienteAnonimo';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit, OnDestroy {

  cliente: Cliente | ClienteAnonimo;
  pedidosActivos: any = [];
  private subscription: Subscription;

  constructor(
    private authService : AuthService,
    public barcodeScanner: BarcodeScanner,
    public vibration : Vibration,
    private toastCtlr: ToastController,
    private pedidoService : PedidosService,
    private clienteService : ClientesService,
    private router: Router
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
      //this.obtenerPedidosActivos();
      console.log(this.cliente);
    });
  }

  obtenerPedidosActivos() {
    this.pedidoService.obtenerPedidosActivos(this.cliente).subscribe(datos => {
      this.pedidosActivos = datos;
      console.log(datos);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('On destroy');
    
  }

  salir(){
    this.authService.logout();
  }

  irListaEspera(): void {
    this.router.navigate(["/lista-espera"])
  }

  irPedidoActivo(): void {
    this.router.navigate(["/pedidos"])
  }

  irFinalizados(): void {
    this.router.navigate(["/finalizados"])
  }

  scanQR(): void {
    this.barcodeScanner.scan({ formats: 'QR_CODE' }).then((data) => {
      if (data.text === 'listaDeEspera') { // Si usa el QR de lista de espera lo llevamos a LE
        this.clienteService.ponerEnListaDeEspera(this.cliente);
        this.irListaEspera();
      }
      else if (this.pedidosActivos.length > 0 && data.text === this.pedidosActivos[0].mesa.qr) {
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
    }, (err) => this.toastCtlr.create({
      message: err ,
      position: 'top',
      duration: 2000,
      color: 'danger',
    }));
 }

}
