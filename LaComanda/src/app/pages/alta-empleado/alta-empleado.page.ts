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
import { UsuariosService } from '../../services/usuarios.service';
import { PerfilUsuario } from '../../models/perfil-usuario.enum';
import { EmpleadosService } from 'src/app/services/empleados.service';

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
    private empleadoService: EmpleadosService,
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

  async registrar(): Promise<void> {
    if(!this.validarForm()) {
      this.presentAlert('Error en el formulario!');
      return;
    }

    this.enEspera = true;

    const aB = await this.file.readAsArrayBuffer(Utils.getDirectory(this.img), Utils.getFilename(this.img));
    const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`
    const blob = new Blob([aB], {type: 'image/jpg'});

    try {
      const {data}: any = await this.authService.registerWhithoutPersistance(this.correo, this.clave);
      console.log('cred', data);
      
      this.usuariosService.agregarUsuarioConAuthId(data.uid, {
        correo: this.correo,
        clave: this.clave,
        perfil: PerfilUsuario.EMPLEADO
      });

      const task = await this.storage.upload(storagePath, blob);

      const empleado: Empleado = {
        correo: this.correo,
        authId: data.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni,
        foto: await task.ref.getDownloadURL(),
        tipo : this.tipo as TipoEmpleado,
        cuil: this.cuil
      };

      this.empleadoService.agregarEmpleado(empleado);

      this.router.navigate(['/home']);
    } catch(err) {
      console.log(err);
      this.errorFirebase();
    } finally {
      this.enEspera = false;
    }
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
