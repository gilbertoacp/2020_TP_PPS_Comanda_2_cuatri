import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';

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

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams
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

}
