import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/models/utils';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, Direction } from '@ionic-native/camera/ngx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoMesa } from 'src/app/models/tipo-mesa.enum';
import { EstadosMesa } from 'src/app/models/estado-mesa.enum';
import { Vibration } from '@ionic-native/vibration/ngx';


@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {

  id: string;
  mesa : Mesa;
  image: any;
  public fotoCargada: boolean = false;
  numeroDeMesa: number;
  comensales: number;
  tipo: TipoMesa;
  foto: string = "";
  fecha: Date = new Date();
  public form: FormGroup;

  imagenPrevista = "../assets/defaultFotoMesa.jpg";

  constructor(
    private file: File,
    private storage:AngularFireStorage,
    private mesaService:MesaService,
    private toastController:ToastController,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private router: Router,
    private vibration : Vibration,
    private route : ActivatedRoute,
  ) { }

  ngOnInit()
  {
    let audio = new Audio();
    audio.src = 'assets/audio/bubble.mp3';
    audio.play();

    this.generarId();

    this.form = this.formBuilder.group({
      numeroDeMesa: ['', [Validators.required, Validators.min(1)]],
      comensales: ['', [Validators.required, Validators.min(2)]],
      tipo: ['', Validators.required]
    });
  }

  get nombreNoValido() {
    return this.form.get('numeroDeMesa').invalid && this.form.get('numeroDeMesa').touched
  }

  get comensalesNoValido() {
    return this.form.get('comensales').invalid && this.form.get('comensales').touched
  }

  get tipoNoValido() {
    return this.form.get('tipo').invalid && this.form.get('tipo').touched
  }

  generarId(): void {
    this.id = Math.random().toString(36).substring(2);
  }

  async registrar()
  {
    if(this.foto != "")
    {
      //AL NO TENER EL FORM.VALID, ETC NO ME ESTA TOMANDO LOS DATOS(LAS DI DE ALTA HARDCODEANDO)
        this.numeroDeMesa = this.form.get('numeroDeMesa').value
        this.comensales = this.form.get('comensales').value;
        this.tipo = this.form.get('tipo').value;

        const directorio = Utils.getDirectory(this.foto);
        const archivo = Utils.getFilename(this.foto);
        
        try {
          const arrayBuffer = await this.file.readAsArrayBuffer(directorio, archivo);
          const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
          
          const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;
          this.storage.upload(storagePath, blob).then(async task => {
  
            const mesa: Mesa = {
              id: this.id,
              numero : this.numeroDeMesa,
              cantidad : this.comensales,
              foto: await task.ref.getDownloadURL(),
              tipo: this.tipo,
              fechaAlta: this.fecha,
              fechaModificado: null,
              fechaBaja: null,
              estado: EstadosMesa.LIBRE,
              qr: 'mesa' + this.numeroDeMesa,
            };
  
            this.mesaService.crearMesa(mesa);
              
            this.presentToastConMensajeYColor("Se registró la mesa correctamente", "success");
  
            let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
            audio.play();
  
            this.limpiarInputs();
  
            this.router.navigate(["home/duenio"]);

          }).catch((error) => {
            console.log(error);
            this.presentToastConMensajeYColor(error.message, "danger");
          })
        } 
        catch(err) {  
          let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonERROR.mp3';
            audio.play();
          this.presentToastConMensajeYColor(err.message, "danger");
          this.vibration.vibrate(500);
          console.log(err);
        }
        finally { 

        }
    }else {
      this.presentToastConMensajeYColor("Debe subir una foto!", "danger");
    }
  }


  limpiarInputs()
  {
    this.numeroDeMesa = null;
    this.comensales = null;
    this.tipo = TipoMesa.NORMAL;
    this.foto = this.imagenPrevista;

  }

  sacarFoto() {
    let audio = new Audio();
    audio.src = 'assets/audio/bubble.mp3';
    audio.play();

    this.camera.getPicture({cameraDirection: Direction.BACK, correctOrientation: true}).then(imageData => {
      this.foto = imageData;

      this.file.readAsDataURL(Utils.getDirectory(imageData), Utils.getFilename(imageData))
      .then(base64Url => {

      this.imagenPrevista = base64Url;
      this.fotoCargada = true;
    }).catch(console.log)
    });
  }
  public mostrarError(control: string): string {
    let retorno = '';

    switch (control) {
      case 'numeroDeMesa':
        if (this.form.controls.numeroDeMesa.hasError('required')) {
          retorno = 'El número de mesa es requerido';
        } else if (this.form.controls.numeroDeMesa.hasError('min')) {
          retorno = 'Ingrese un número de mesa válido.';
        } else {
          retorno = 'Error inesperado con el número de mesa';
        }
        break;
      case 'comensales':
        if (this.form.controls.comensales.hasError('required')) {
          retorno = 'El número de comensales es requerido.';
        } else if (this.form.controls.comensales.hasError('min')) {
          retorno = 'Los comensales tienen que ser mínimo 2.';
        } else {
          retorno = 'Error inesperado con la cantidad de comensales';
        }
        break;
      case 'tipo':
        if (this.form.controls.tipo.hasError('required')) {
          retorno = 'El tipo de mesa es requerido.';
        } else {
          retorno = 'Error inesperado con el tipo de mesa';
        }
        break;
    }

    return retorno;
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

  atras()
  {
    this.router.navigate(["home/duenio"]);
  }

}
