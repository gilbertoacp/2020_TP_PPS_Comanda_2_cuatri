import { Component, OnInit } from '@angular/core';
import { TipoEmpleado } from 'src/app/models/tipo-empleado.enum';
import { AngularFireStorage } from '@angular/fire/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, Direction } from '@ionic-native/camera/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { DNI } from '../../models/dni.enum';
import { Utils } from '../../models/utils';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/models/empleado';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from '../../services/empleado.service';
import { UsuariosService } from '../../services/usuarios.service';
import { PerfilUsuario } from '../../models/perfil-usuario.enum';
import { ThrowStmt } from '@angular/compiler';
import { FirebaseApp } from '@angular/fire';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
})
export class AltaEmpleadoPage implements OnInit {

  enEspera: boolean = false;
  correo: string;
  clave: string;
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  tipo: TipoEmpleado;
  img: string;
  imagenVista = 'assets/img/noimage.png';
  errMsj: string = '';

  constructor(
    private file: File,
    private camera: Camera,
    private router: Router,
    private storage: AngularFireStorage,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private authService: AuthService,
    private empleadoService: EmpleadoService,
    private usuariosService: UsuariosService,
  ) { }

  ngOnInit() {
  }

  escanear(): void {
    this.barcodeScanner.scan({
      prompt: 'Coloque el código en el rectángulo',
      formats: "PDF_417"
    })
    .then(data => {
      const dniData = data.text.split('@');
      this.nombre = dniData[DNI.NOMBRES];
      this.apellido = dniData[DNI.APELLIDOS];
      this.dni = dniData[DNI.NUMERO_DOCUMENTO];
    });
  }

  tomarFoto(): void {
    this.camera.getPicture({cameraDirection: Direction.BACK, correctOrientation: true}).then(imageData => {
      this.img = imageData;

      this.file.readAsDataURL(Utils.getDirectory(imageData), Utils.getFilename(imageData))
      .then(base64Url => {
        this.imagenVista = base64Url;
      })
      .catch(console.log);
    });
  }

  validarForm(): boolean {
    this.errMsj = '';
    let sinValoresVacios = false;
    let emailValido = false;
    let fotoSubida = false;

    if(
      !Utils.isEmpty(this.correo) ||
      !Utils.isEmpty(this.nombre) ||
      !Utils.isEmpty(this.dni) ||
      !Utils.isEmpty(this.clave) ||
      !Utils.isEmpty(this.cuil) ||
      this.tipo
    ) {
      sinValoresVacios = true;

      if(Utils.validEmail(this.correo)) {
        emailValido = true;
      }

      if(!Utils.isEmpty(this.img)) {
        fotoSubida = true;
      }
    }


    if(!sinValoresVacios) {
      this.errMsj += 'Los campos no deben estar vacios';
      return false;
    }
    
    if(!emailValido) {
      this.errMsj += 'Ingrese un email valido\n'
      return false;
    }

    if(!fotoSubida) {
      this.errMsj += 'Tiene que subir una imagen';
      return false;
    }

    if(sinValoresVacios && emailValido) {
      return true;
    }

  }

  registrar(): void {

    if(!this.validarForm()) {
      this.presentAlert(this.errMsj);
      return;
    }
    this.enEspera = true;
    this.file.readAsArrayBuffer(Utils.getDirectory(this.img), Utils.getFilename(this.img))
    .then(arrayBuffer => {
      const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
      const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;

      this.authService.register(this.correo, this.clave).then(cred => {

        this.usuariosService.agregarUsuarioConAuthId(cred.user.uid, {
          correo: this.correo,
          clave: this.clave,
          perfil: PerfilUsuario.EMPLEADO
        });

        this.storage.upload(storagePath, blob).then(async task => {
          const empleado: Empleado = {
            correo: cred.user.email,
            authId: cred.user.uid,
            nombre: this.nombre,
            apellido: this.apellido,
            dni: this.dni,
            foto: await task.ref.getDownloadURL(),
            tipo : this.tipo as TipoEmpleado,
            cuil: this.cuil
          };
          this.empleadoService.agregarEmpleado(empleado);

          this.enEspera = false;
          this.router.navigate(['..']);
        })
        .catch(() => {
          this.errorFirebase();
        });
      })
      .catch(() => {
        this.errorFirebase();
      })
    });
  }

  private errorFirebase(): void {
    this.errMsj = 'No se ha podido hacer el alta, intentelo de nuevo';
    this.presentAlert('');
    this.enEspera = false;
  }
  
  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: msj,
      message: this.errMsj,
      buttons: ['OK']
    });

    await alert.present();
  }
}
