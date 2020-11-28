import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { Vibration } from '@ionic-native/vibration/ngx';
import { ClientesService } from 'src/app/services/clientes.service';
import { Usuario } from 'src/app/models/usuario';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum'
import { Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  listar:boolean=false;
  clave:string;
  perfil:string;
  correo:string;
  cargando:boolean=false;
  usuario: Usuario;
  passwordType:string = 'password';
  eyeType:string = 'eye-off-outline';
  passwordShown:boolean = false;
  suscripcion:Subscription;

  constructor(
    private userService : UsuariosService,
    private clienteService : ClientesService,
    private authService: AuthService,
    private toastCtlr: ToastController,
    private router: Router,
    private vibration: Vibration,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }
  
  Register(cliente : string){
    this.router.navigate(["/register"], {state : {modo: cliente}});
  }

  async Login() {

    this.cargando = true;

    const respuesta = await this.authService.login(this.correo, this.clave);

    if(respuesta)
    {
      this.userService.getUser(respuesta.user.uid).subscribe(async usuario =>
        {
          if(usuario.perfil == PerfilUsuario.CLIENTE && this.clienteService.correoRepetidoFB(usuario.correo))
          {
            this.router.navigate(['/home']);
            setTimeout(() => this.cargando = false, 2500);
  
            let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
            audio.play();
          }
          else if(usuario.perfil == PerfilUsuario.CLIENTE && !this.clienteService.correoRepetidoFB(usuario.correo))
          {
            let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonERROR.mp3';
            audio.play();
            this.vibration.vibrate(2000);
      
            this.toastCtlr.create({
              message: 'Error, todavía no se aprobo su registro',
              position: 'top',
              duration: 2000,
              color: 'danger',

            }).then(t => {
              this.cargando = false;
              t.present();
            });

          }else
          {

            this.toastCtlr.create({
              message: 'Error, todavía no se aprobo su registro',
              position: 'top',
              duration: 2000,
              color: 'danger',

            })

            this.router.navigate(['/home']);
            setTimeout(() => this.cargando = false, 2500);
  
            let audio = new Audio();
            audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
            audio.play();
          }
          
        })
      
    }
    else
    {

      this.toastCtlr.create({
        message: 'Error, por favor verifique que los campos sean correctos',
        position: 'top',
        duration: 2000,
        color: 'danger',
        
      })
      .then(t => {
        this.cargando = false;
        t.present();
      });
    }
      
  }


  tooglePassword() {
    if(this.passwordShown){
      this.passwordShown = false;
      this.passwordType = 'password';
      this.eyeType = 'eye-off-outline';
    }else{
      this.passwordShown = true;
      this.passwordType = 'text';
      this.eyeType = 'eye-outline';
    }
  }

  usuarioSeleccionado({currentTarget}) {

    let audio = new Audio();
        audio.src = 'assets/audio/bubble.mp3';
        audio.play();

    switch(currentTarget.value) {
      case 'duenio':
        this.correo = 'pepito@pepito.com';
        this.clave = '111111';
      break;

      case 'mozo':
        this.correo = 'antonio@antonio.com';
        this.clave = '111111';
      break;

      case 'cocinero':
        this.correo = 'pedrito@pedrito.com';
        this.clave = '111111';
      break;

      case 'bartender':
        this.correo = 'jose@jose.com';
        this.clave = '111111';
      break;

      case 'metre':
        this.correo = 'metre@metre.com';
        this.clave = '111111';
      break;

      case 'cliente':
        this.correo = 'laucha190499@gmail.com';
        this.clave = '123456';
      break;

      case 'supervisor':
        this.correo = 'miguel@miguel.com';
        this.clave = '111111';
      break;
    }
  }
}
