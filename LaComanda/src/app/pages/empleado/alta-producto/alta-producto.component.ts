import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from '../../../models/empleado';
import { TipoEmpleado } from '../../../models/tipo-empleado.enum';

import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Utils } from '../../../models/utils';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { firestore } from 'firebase/app';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/producto';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {

  fotos = [];
  id: string;
  tipo: 'bebida' | 'plato';
  empleado: Empleado;
  nombre: string;
  descripcion: string;
  tiempoPreparacion: string;
  precio: string;
  imagenDefault =  'assets/img/noimage.png';
  preVistaFotos = [this.imagenDefault, this.imagenDefault, this.imagenDefault];
  enEspera: boolean = false;

  constructor(
    private router: Router,
    private camera: Camera,
    private file: File,
    private storage: AngularFireStorage,
    private productoService: ProductoService,
    private bs: BarcodeScanner,
    private alertController: AlertController
  ) { 
    if(this.router.getCurrentNavigation().extras.state.empleado) {
      this.empleado = this.router.getCurrentNavigation().extras.state.empleado;

      if(this.empleado.tipo == TipoEmpleado.BARTENDER) {
        this.tipo = 'bebida';
      } else {
        this.tipo = 'plato'
      }
    }
  }

  ngOnInit() {
    this.generarId();
  }
  
  generarId(): void {
    this.id = Math.random().toString(36).substring(2);
  }

  tomarFoto(): void {
    this.camera.getPicture({
      correctOrientation: true,
      cameraDirection: this.camera.Direction.BACK
    })
    .then(path => {
      const directorio = Utils.getDirectory(path);
      const nombre =  Utils.getFilename(path);

      this.agregarFoto(directorio, nombre);
    })
    .catch(err => {
      console.log(err);
    });
  }

  subirFotoGaleria(): void {
    this.camera.getPicture({
      sourceType: PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      correctOrientation: true
    })
    .then(path => {
      const directorio = Utils.getDirectory(path);
      const nombre = Utils.getFilenameGallery(path);

      this.agregarFoto(directorio, nombre);
    })
    .catch(err => {
      console.log(err);
    });
  }

  escanear(): void {
    this.bs.scan({formats: 'QR_CODE'}).then(data => {
      if(data.text) {
        const productoData = data.text.split('@');
        if(this.tipo === 'bebida' && productoData[5] !== 'bebida') {
          this.presentAlert('Denegado','Sólo el mozo puede agregar un plato');
          return;
        }

        if(this.tipo === 'plato' && productoData[5] !== 'plato') {
          this.presentAlert('Denegado','Sólo el bartender puede agregar una bebida');
          return;
        }

        this.id = productoData[0];
        this.nombre = productoData[1];
        this.descripcion = productoData[2];
        this.tiempoPreparacion = productoData[3];
        this.precio = productoData[4];
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  async agregarFoto(directorio: string, nombre: string): Promise<void> {
    try {
      const arrayBuffer = await this.file.readAsArrayBuffer(directorio, nombre);
      const base64Url = await this.file.readAsDataURL(directorio, nombre);
  
      // se agrega foto real
      this.fotos.push(new Blob([arrayBuffer], { type: 'image/jpg' }));
  
      // se agrega foto en la vista
      for(const idx in this.preVistaFotos) {
        if(this.preVistaFotos[idx] === this.imagenDefault) {
          this.preVistaFotos[idx] = base64Url;
          break;
        }
      }

    } catch(err) {
      console.log(err);
    }
  }

  limpiarForm(): void {
    this.descripcion = null;
    this.tiempoPreparacion = null;
    this.nombre = null;
    this.precio = null;
    this.fotos = [];
    for(const idx in this.preVistaFotos) 
      this.preVistaFotos[idx] = this.imagenDefault;
  }

  formValido(): boolean {
    if(Utils.isEmpty(this.descripcion) &&
       Utils.isEmpty(this.tiempoPreparacion) &&
       Utils.isEmpty(this.nombre) &&
       Utils.isEmpty(this.precio)) {
        return false; 
       }    
    return true;
  }

  async registrar(): Promise<void> {

    if(!this.formValido()) {
      this.presentAlert('Error', 'Los campos ingresado no deben estar vacio!');
      return;
    }

    if(this.fotos.length < 3) {
      this.presentAlert('Error', 'Tiene que subir 3 fotos!');
      return;
    }

    this.enEspera = true;

    const fotosFirebaseStorageUploadTask: AngularFireUploadTask[] = []

    for(const idx in this.fotos) {
      const pathFoto = `images/productos/${this.descripcion}_${idx+1}__${Math.random().toString(36).substring(2)}`;
      fotosFirebaseStorageUploadTask.push(this.storage.upload(pathFoto, this.fotos[idx]));
    }
    
    try {
      const fotosTasks: UploadTaskSnapshot[] = await Promise.all(fotosFirebaseStorageUploadTask);

      const producto: Producto = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        precio: this.precio,
        tiempoElaboracion: this.tiempoPreparacion,
        fotos: firestore.FieldValue.arrayUnion(
          await fotosTasks[0].ref.getDownloadURL(),
          await fotosTasks[1].ref.getDownloadURL(),
          await fotosTasks[2].ref.getDownloadURL(),
        ),
        id: this.id,
        tipoProducto: this.tipo
      };

      await this.productoService.agregarProducto(producto);
  
      this.limpiarForm();
      this.presentAlert('Exito', 'Se ha agregado el producto exitosamente!');

    }  catch(err) {

      console.log(err);
      this.presentAlert('Error!!', 'No se pudo agregar el producto, intentlo de nuevo');

    } finally {

      this.enEspera = false;
    
    }
    
  }

  async presentAlert(header: string,msj: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }
}
