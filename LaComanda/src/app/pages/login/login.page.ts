import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { Vibration } from '@ionic-native/vibration/ngx';

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
  passwordType:string = 'password';
  eyeType:string = 'eye-off-outline';
  passwordShown:boolean = false;

  constructor(
    private authService: AuthService,
    private toastCtlr: ToastController,
    private router: Router,
    private vibration: Vibration
  ) { }

  ngOnInit() {
  }
  
  Register(cliente : string){
    this.router.navigate(["/register"], {state : {modo: cliente}});
  }

  Login(){
    this.cargando = true;

    this.authService.login(this.correo, this.clave).then(() => {
      this.router.navigate(['/home']);
      setTimeout(() => this.cargando = false, 2500);

      let audio = new Audio();
      audio.src = 'assets/audio/login/sonidoBotonSUCESS.mp3';
      audio.play();
    })
    .catch(() => {

      let audio = new Audio();
      audio.src = 'assets/audio/login/sonidoBotonERROR.mp3';
      audio.play();
      this.vibration.vibrate(2000);

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
    });
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
        this.correo = 'duenio01@duenio.com';
        this.clave = '111111';
      break;
      case 'empleado':
        this.correo = 'empleadotest@empleadostest.com';
        this.clave = '111111';
      break;
    }
  }
}
