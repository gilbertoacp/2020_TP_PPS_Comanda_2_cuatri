import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Utils } from '../../models/utils';
import { AngularFireStorage } from '@angular/fire/storage';
import { Producto } from '../../models/producto';
import { firestore } from 'firebase';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage implements OnInit {

  fotos = [];
  nombre: string;
  descripcion: string;
  tiempoPromedioElaboracion: any;
  precio: number;
  imagenDefault =  'assets/img/noimage.png';
  qrDato: string;
  qrImg: Blob;
  preVistaFotos = [
    this.imagenDefault,
    this.imagenDefault,
    this.imagenDefault
  ];

  constructor(
    private camera: Camera,
    private file: File,
    private storage: AngularFireStorage,
    private productoService: ProductoService
  ) {  }

  ngOnInit() {
  }

  crearCodigo(): void {
    this.qrDato = Math.random().toString(36).substring(2);
    setTimeout(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      canvas.toBlob(blob => this.qrImg = blob, 'image/jpeg');
    }, 250);
  }

  tomarFotos():void {
    this.camera.getPicture({
      correctOrientation: true,
      cameraDirection: this.camera.Direction.BACK
    })
    .then(path => {
      const directorio = Utils.getDirectory(path);
      const nombre =  Utils.getFilename(path);

      this.file.readAsArrayBuffer(directorio, nombre).then(arrayBuffer => {
        this.fotos.push(new Blob([arrayBuffer], { type: 'image/jpg' }));
      });

      this.file.readAsDataURL(directorio, nombre).then(base64Url => {
        for(const idx in this.preVistaFotos) {
          if(this.preVistaFotos[idx] === this.imagenDefault) {
            this.preVistaFotos[idx] = base64Url;
            break;
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  deshacerFotos(): void {
    this.fotos = [];
    for(const idx in this.preVistaFotos) 
      this.preVistaFotos[idx] = this.imagenDefault;
  }

  async registrar(): Promise<void> {
    const fotosFirebaseStorageUploadTask = []

    for(const idx in this.fotos) {
      const pathFoto = `images/productos/${this.descripcion}_${idx+1}__${Math.random().toString(36).substring(2)}`;
      fotosFirebaseStorageUploadTask.push(this.storage.upload(pathFoto, this.fotos[idx]));
    }

    const fotosTasks = await Promise.all(fotosFirebaseStorageUploadTask);

    const fotoQrTask = await this.storage.upload(`images/productos/${this.descripcion}_QR__${Math.random().toString(36).substring(2)}`, this.qrImg);

    const producto: Producto = {
      descripcion: this.descripcion,
      precio: this.precio,
      tiempoElaboracion: this.tiempoPromedioElaboracion,
      fotos: fotosTasks.map(async task => await task.ref.getDownloadURL()),
      id: this.qrDato,
      qrImg: await fotoQrTask.ref.getDownloadURL()
    };

    this.productoService.agregarProducto(producto);
  }
}
