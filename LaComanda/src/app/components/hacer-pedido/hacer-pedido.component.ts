import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Empleado } from '../../models/empleado';
import { Cliente } from '../../models/cliente';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Pedido } from 'src/app/models/pedido';
import { Mesa } from 'src/app/models/mesa';
import { EstadoPedido } from 'src/app/models/estadoPedido.enum';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-hacer-pedido',
  templateUrl: './hacer-pedido.component.html',
  styleUrls: ['./hacer-pedido.component.scss'],
})
export class HacerPedidoComponent implements OnInit {

  mesa: Mesa;
  cargando = true;
  cliente: Cliente;
  empleado: Empleado;
  segment = 'bebidas';
  precioTotal: number = 0;
  pedido: Producto[] = [];
  platos: Producto[] = [];
  bebidas: Producto[] = [];
  
  sliderConfig = {
    spaceBetween: 10,
    centeredSlide: true,
    slidesPerView: 1.2,
  }

  sliderImg = {
    spaceBetween: 10,
    centeredSlide: true,
    slidesPerView: 1,
  }

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private productosService: ProductoService,
    private bs: BarcodeScanner,
    private alertCtrl: AlertController,
    private pedidosService: PedidosService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit() {
    this.empleado = this.navParams.get('empleado')?? null;
    this.cliente = this.navParams.get('cliente')?? null;
    
    this.productosService.productos.subscribe(productos => {
      this.bebidas = productos.filter(p => p.tipoProducto === 'bebida');
      this.platos = productos.filter(p => p.tipoProducto === 'plato');
      this.cargando = false;
    });
  }
  
  agregarAlPedido(producto: Producto): void {
    if(!this.estaEnElPedido(producto)) {
      producto.cantidad = 1;
      this.pedido.push(producto);
    } else {
      const p = this.pedido.filter(p => p.id === producto.id);
      p[0].cantidad++;
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

  estaEnElPedido(producto: Producto): boolean {
    return this.pedido.some(p => p.id === producto.id);
  }

  escanearProducto(): void {
    this.bs.scan({formats: 'QR_CODE'}).then(data => {
      if(data.text) {
        const productoData = data.text.split('@');
        if(productoData[5] === 'bebida' || productoData[5] === 'plato') {

          const producto: Producto = {
            id: productoData[0],
            nombre: productoData[1],
            descripcion: productoData[2],
            tiempoElaboracion: productoData[3],
            precio: parseInt(productoData[4]),
            tipoProducto: productoData[5],
            fotos: productoData[5] === 'bebida' ?
                  this.bebidas.filter(p => p.id === productoData[0])[0].fotos: 
                  this.platos.filter(p => p.id === productoData[0])[0].fotos
          }

          this.agregarAlPedido(producto);
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  confirmarPedido(): void {
    let htmlTemplate = `
    <ion-list>
    `;

    this.pedido.forEach(p => {
      htmlTemplate += `
      <ion-item>
        <ion-label>${p.nombre}</ion-label>
        <ion-text color="light" slot="end">${p.cantidad * p.precio}$</ion-text>
      </ion-item>
      `;
    });
    
    htmlTemplate += `
    <ion-item>
      <ion-label>Precio Total: ${this.precioTotal}$</ion-label>
    </ion-item>
    </ion-list>`;


    this.mostrarConfirm('Resumen del pedido', htmlTemplate);
  }

  async mostrarConfirm(header?: string, msj?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alerta',
      header: header,
      message: msj,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Okay',
          handler: async () => {
            const pedido: Pedido = {
              productos: this.pedido,
              numeroMesa: this.mesa.numero,
              estado: EstadoPedido.PENDIENTE,
              codigo: Math.random().toString(36).substring(2),
            }

            try {
              await this.pedidosService.hacerPedido(pedido);

              this.notificacionesService.toast(
                'Se ha realizado el pedido, espere que el mozo lo confirme!!', 
                'bottom', 
                2500, 
                'success'
              );
            } catch {
              this.notificacionesService.toast(
                'Ocurrio un error, al hacer el pedido!, intentelo de nuevo', 
                'top', 
                2500, 
                'danger'
              );
            } finally {
              this.modalCtrl.dismiss();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}
