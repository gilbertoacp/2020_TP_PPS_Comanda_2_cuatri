import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { FormControl,ValidatorFn, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Camera, Direction } from '@ionic-native/camera/ngx';
import { TipoCliente } from 'src/app/models/tipo-cliente.enum';
import { Cliente } from 'src/app/models/cliente';
import { File } from '@ionic-native/file/ngx';
import { Utils } from '../../models/utils';
import { ClientesService } from '../../services/clientes.service';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public usuario: Cliente;
  public image: any;
  public form: FormGroup;
  public fotoCargada: boolean = false;
  title = "Cliente anónimo";

  nombre: string = "";
  apellido: string = "";
  dni: number = null;
  email: string = "";
  clave: string = "";
  claveConfirmada: string = "";
  tipo: TipoCliente;
  foto: string = "";

  mostrarSpinner = false;
  mostrarNombre = true;
  modoRegistro = true;
  anonimo = true;

  imagenPrevista = "../assets/img/cliente.png";

  //private dbStorage: StorageService

  constructor(
    private usuariosService : UsuariosService,
    private authService : AuthService,
    private storage : AngularFireStorage,
    private file : File,
    private cliente: ClientesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private camera: Camera,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    private notificacionesService: NotificacionesService
    //private toastService:ToastService,
  ) {}

  ngOnInit() {
    this.modoRegistro = this.router.getCurrentNavigation().extras.state.modo;
    this.notificacionesService.burbuja();

    if (this.modoRegistro) {
      this.title = "Registrar cliente";
      this.form = this.formBuilder.group({      
        password: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ])),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')
        ])),
        passConfirmada: new FormControl(''),
        nombre: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z\\s]+$')
        ])),
        apellido: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z\\s]+$')
        ])),
        dni: new FormControl('', Validators.compose([
          Validators.pattern('^[0-9]{8}$'),
          Validators.required
        ])),
      });
      this.form.controls["passConfirmada"].setValidators([this.confirmarPassword(), Validators.required])
    }
    else
    {
      this.anonimo = false;
      this.form = this.formBuilder.group({     
        nombre: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z\\s]+$')
        ]))
      });
    }
  }


  confirmarPassword(): ValidatorFn {
    const passw = () => {
      const pass = this.form.get('password').value;
      const okPass = this.form.get('passConfirmada').value;
      const isValidPassword = pass === okPass
      if (isValidPassword || okPass == "") return null;

      return { "passwordError": true }
    }
    return passw;
  }

  async register() {
    this.mostrarSpinner = true;
    this.notificacionesService.burbuja();

    if(this.foto != "")
    {

      if(this.modoRegistro == true) {

        this.tipo = TipoCliente.REGISTRADO;

        this.file.readAsArrayBuffer(Utils.getDirectory(this.foto), Utils.getFilename(this.foto)).then(arrayBuffer => {
          
          const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
          const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;

          this.authService.register(this.email, this.clave).then(cred => {
            this.usuariosService.agregarUsuarioConAuthId(cred.user.uid, {
              correo: this.email,
              clave: this.clave,
              perfil: PerfilUsuario.CLIENTE
            });
            this.storage.upload(storagePath, blob).then(async task => {

              const cliente: Cliente = {
                authId: cred.user.uid,
                nombre: this.nombre,
                apellido: this.apellido,
                dni: this.dni,
                correo: cred.user.email,
                contraseña: this.clave,
                foto: await task.ref.getDownloadURL(),
                tipo : this.tipo,
                estado : 'enEspera',
                atendido: 'esperando',
                reserva: 'no',
                horaReserva: ''
              };

              this.cliente.registrarCliente(cliente);
                
              this.presentToastConMensajeYColor("Se está procesando su solicitud.", "success");

              this.notificacionesService.exito();
              this.limpiarInputs();

              this.mostrarSpinner = false;

              this.router.navigate(["/login"]); //......
            }).catch((error) => {
              this.presentToastConMensajeYColor(error.message, "danger");
            })
            .finally(() => {
              this.mostrarSpinner = false;
            });
          }).catch((e) => {
            this.presentToastConMensajeYColor(e.message, "danger");
          })
          .finally(() => {
            this.mostrarSpinner = false;
          });
        });
      } else {
        const directorio = Utils.getDirectory(this.foto);
        const archivo = Utils.getFilename(this.foto);
        
        try {
          const arrayBuffer = await this.file.readAsArrayBuffer(directorio, archivo);
          const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
          
          const storagePath = `images/anonimos/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;

          const uploadTask = await this.storage.upload(storagePath, blob);

          const credentials = await this.authService.loginAnonymously()

          this.cliente.registrarCliente({
              authId:credentials.user.uid,
              nombre: this.nombre,
              foto: await uploadTask.ref.getDownloadURL(),
              atendido: 'libre',
              estado: 'aceptado',
              tipo: TipoCliente.ANONIMO
          });

          this.reproducirAudio();
          this.router.navigate(['/home']);
        } 
        catch(err) {  
          this.reproducirAudio(true);
          this.presentToastConMensajeYColor(err.message, "danger");
        }
        finally { 
          this.mostrarSpinner = false;
        }
      }
    }else {
      this.presentToastConMensajeYColor("Debe subir una foto!", "danger");
    }
  }

  /** Debería ponerse en un servicio */
  reproducirAudio(error?: boolean): void {
    let audio = new Audio();
    if(!error) {
      audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
    } else {
      audio.src = 'assets/audio/login/sonidoBotonERROR.mp3';
    }
    audio.play();
  }

  scan() {
    this.notificacionesService.burbuja();

    this.barcodeScanner.scan({ formats: "PDF_417" }).then(barcodeData => {
      let scannedCode = barcodeData.text;
      let userQR = scannedCode.split("@");
      this.apellido = this.limpiar(userQR[1]);
      this.nombre = this.limpiar(userQR[2]);
      let auxDni = this.limpiar(userQR[4]);
      this.dni = parseInt(auxDni);
    }).catch(error => {
      this.presentToastConMensajeYColor("Error al scanear DNI", "danger");
    });
  }

  limpiar(s: string) {
    let palabra = s.toLowerCase().split(' ');
    for (let i = 0; i < palabra.length; i++) {
      palabra[i] = palabra[i].charAt(0).toUpperCase() + palabra[i].substring(1);
    }
    return palabra.join(' ');
  }

  limpiarInputs(){
    console.log("usu", this.usuario)
    this.nombre = "";
    this.apellido = "";
    this.dni = null;
    this.email = "";
    this.clave = "";
    this.claveConfirmada = "";
    this.foto = this.imagenPrevista;
    // this.usuario.cuil = 0;
    // this.usuario.dni = 0;
  }

  mensajesValidacion = {
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingrese un correo electrónico válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe contener al menos 6 catacteres.' }
    ],
    'passConfirmada': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'passwordError', message: 'Las contraseñas ingresadas no coinciden' }
    ],
    'nombre': [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'pattern', message: 'Ingrese un nombre válido.' }
    ],
    'apellido': [
      { type: 'required', message: 'La apellido es requerido.' },
      { type: 'pattern', message: 'Ingrese un apellido válido.' }
    ],
    'dni': [
      { type: 'pattern', message: 'El DNI debe contener 8 carácteres númericos.' },
      { type: 'required', message: 'El DNI es requerido.' },
    ]
  };


  sacarFoto() {
    let audio = new Audio();
    audio.src = 'assets/audio/bubble.mp3';
    audio.play();


    if (this.modoRegistro == true) {
      this.camera.getPicture({cameraDirection: Direction.BACK, correctOrientation: true}).then(imageData => {
        this.foto = imageData;
  
        this.file.readAsDataURL(Utils.getDirectory(imageData), Utils.getFilename(imageData))
        .then(base64Url => {

        this.imagenPrevista = base64Url;
        this.fotoCargada = true;
      }).catch(console.log)
    });
    }
    else {
      this.camera.getPicture({cameraDirection: Direction.BACK, correctOrientation: true}).then((imageData) => {
        this.foto = imageData;
  
        this.file.readAsDataURL(Utils.getDirectory(imageData), Utils.getFilename(imageData))
        .then(base64Url => {
          this.imagenPrevista = base64Url;
          this.fotoCargada = true;
        }).catch(console.log);
      });
    }
  }

  async presentToastConMensajeYColor(mensaje : string, color : string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'bottom',
      duration: 3000,
      color: color,
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
        }
      ]
    });

    toast.present();
  }
}
