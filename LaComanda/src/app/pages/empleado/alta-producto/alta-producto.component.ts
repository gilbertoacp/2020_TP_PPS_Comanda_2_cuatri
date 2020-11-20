import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from '../../../models/empleado';
import { TipoEmpleado } from '../../../models/tipo-empleado.enum';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Utils } from '../../../models/utils';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {

  fotos = [];
  id: string;
  esBartender: boolean; 
  esCocinero: boolean;
  empleado: Empleado;
  nombre: string;
  descripcion: string;
  tiempoPreparacion: string;
  precio: string;
  imagenDefault =  'assets/img/noimage.png';
  preVistaFotos = [
    this.imagenDefault,
    this.imagenDefault,
    this.imagenDefault
  ];

  constructor(
    private router: Router,
    private camera: Camera,
    private file: File,
    private storage: AngularFireStorage,
    private productoService: ProductoService
  ) { 
    if(this.router.getCurrentNavigation().extras.state.empleado) {
      this.empleado = this.router.getCurrentNavigation().extras.state.empleado;

      if(this.empleado.tipo == TipoEmpleado.BARTENDER) {
        this.esBartender = true;
        this.esCocinero = false;
      } else {
        this.esBartender = false;
        this.esCocinero = true;
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

  escanear(): void {

  }

  async agregar(): Promise<void> {
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

    const producto: Producto = {
      descripcion: this.descripcion,
      precio: this.precio,
      tiempoElaboracion: this.tiempoPreparacion,
      fotos: fotosTasks.map(async task => await task.ref.getDownloadURL()),
      id: this.id,
      tipoProducto: this.esBartender? 'bebida': 'plato'
    };

    this.productoService.agregarProducto(producto);
  }
}
