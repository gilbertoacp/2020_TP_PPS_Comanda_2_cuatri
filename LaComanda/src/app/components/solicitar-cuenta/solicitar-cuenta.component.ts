import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-solicitar-cuenta',
  templateUrl: './solicitar-cuenta.component.html',
  styleUrls: ['./solicitar-cuenta.component.scss'],
})
export class SolicitarCuentaComponent implements OnInit {

  cliente: Cliente;
  mesa: Mesa;
  pedido: Pedido;
  precioTotal: number;
  propina: number;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private bs: BarcodeScanner,
    private pedidosService: PedidosService
  ) { }

  ngOnInit() {
    this.cliente = this.navParams.get('cliente')?? null;
    this.mesa = this.navParams.get('mesa')?? null;
    this.pedido = this.navParams.get('pedido')?? null;

    this.precioTotal = this.pedido.productos.reduce((acc: number, p: Producto) => {
      if(p.cantidad > 1) {
        acc += p.cantidad * p.precio;
      } else {
        acc += p.precio;
      }

      return acc;
    }, 0);

  }

  async escanearPropina(): Promise<void> {
    const result: BarcodeScanResult = await this.bs.scan({formats:'QR_CODE'});

    if(result.text) {
      const porcentaje = parseInt(result.text.split('_')[2]);
      const auxPropina = this.precioTotal * porcentaje / 100;

      if(this.propina) {
        this.precioTotal -= this.propina;
        this.precioTotal += auxPropina;
        this.propina = auxPropina;
      } 
      else  {
        this.precioTotal += auxPropina;
        this.propina = auxPropina;
      }
    }
  }

  pagar(): void {
    this.pedidosService.pagoCliente(
      this.pedido.docId, 
      this.mesa.docId, 
      this.cliente.docId
    );

    this.modalCtrl.dismiss('pagando');
  }

}
