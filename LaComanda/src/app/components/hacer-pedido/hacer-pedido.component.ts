import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Empleado } from '../../models/empleado';
import { Cliente } from '../../models/cliente';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.component.html',
  styleUrls: ['./hacer-pedido.component.scss'],
})
export class HacerPedidoComponent implements OnInit {

  pedido: Producto[] = [];
  cliente: Cliente;
  empleado: Empleado;
  precioTotal: number = 0;
  platos: Producto[] = [];
  bebidas: Producto[] = [];
  
  sliderConfig = {
    spaceBetween: 10,
    centeredSlide: true,
    slidesPerView: 1.2
  }

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private productosService: ProductoService
  ) { }

  ngOnInit() {
    // si es el mozo o el metre que hace el pedido, seteo la variable empleado
    if(this.navParams.get('empleado')) {
      this.empleado = this.navParams.get('empleado');
    }

    // si es el cliente que hace el pedido, seteo la variable cliente
    if(this.navParams.get('cliente')) {
      this.cliente = this.navParams.get('cliente');
    }

    // tomo los datos de la db para obtener los platos y bebidas
    this.productosService.productos.subscribe(productos => {
      this.bebidas = productos.filter(p => p.tipoProducto === 'bebida');
      this.platos = productos.filter(p => p.tipoProducto === 'plato');
    });
  }
  
  agregarAlPedido(producto: Producto): void {
    if(!this.pedido.includes(producto)) {
      producto.cantidad = 1;
      this.pedido.push(producto);
    } else {
      producto.cantidad += 1;
    }

    this.calcularPrecio();
  }

  eliminarUno(producto: Producto): void {
    if(producto.cantidad === 1) {
      this.pedido.splice(this.pedido.indexOf(producto), 1);
    } else {
      producto.cantidad -= 1;
    }

    this.calcularPrecio();
  }

  calcularPrecio(): void {
    this.precioTotal = this.pedido.reduce((acc: number, p: Producto) => {
      if(p.cantidad > 1) {
        acc += p.cantidad * p.precio;
      } else {
        acc += p.precio;
      }

      return acc;
    }, 0);
  }

  confirmarPedido(): void {

  }
}
