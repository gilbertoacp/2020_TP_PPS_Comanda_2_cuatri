import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Usuario } from 'src/app/models/usuario';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum'
import { Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

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
    private router: Router,
    public navCtrl: NavController,
    public notificacionesService: NotificacionesService
  ) { }

  ngOnInit() {
  }
  
  Register(cliente : string){
    this.router.navigate(["/register"], {state : {modo: cliente}});
  }

  async Login() {

    this.cargando = true;

    try {
      const respuesta = await this.authService.login(this.correo, this.clave);

      this.userService.getUser(respuesta.user.uid).subscribe(usuario => {

        if(usuario.perfil == PerfilUsuario.CLIENTE && this.clienteService.correoRepetidoFB(usuario.correo))
        {
          this.router.navigate(['/home']);
          this.cargando = false;
          this.notificacionesService.exito();
        }
        else if(usuario.perfil == PerfilUsuario.CLIENTE && !this.clienteService.correoRepetidoFB(usuario.correo))
        {
          this.notificacionesService.error();
          this.notificacionesService.vibrar(1000);
          this.notificacionesService.toast(
            'Error, todavía no se aprobo su registro',
            'top',
            2000,
            'danger'
          );
          this.cargando = false;
        }else
        {
          this.router.navigate(['/home']);
          this.cargando = false;
          this.notificacionesService.exito();
        }

      });
    } catch {
      this.notificacionesService.toast(
        'Error, por favor verifique que los campos sean correctos',
        'top',
        2000,
        'danger',
      );
      this.cargando = false;
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

    this.notificacionesService.burbuja();

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

      case 'anonimo':
        this.correo = 'anonimo@anonimo.com';
        this.clave = '111111';
      break;

      case 'supervisor':
        this.correo = 'miguel@miguel.com';
        this.clave = '111111';
      break;
    }
  }
}
