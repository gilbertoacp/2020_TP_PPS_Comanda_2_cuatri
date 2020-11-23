import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Empleado } from '../../models/empleado';
import { Cliente } from '../../models/cliente';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

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
    private productosService: ProductoService,
    private bs: BarcodeScanner,
    private alertCtrl: AlertController
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
        console.log(data.text);
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
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
  
    await alert.present();
  }
}
