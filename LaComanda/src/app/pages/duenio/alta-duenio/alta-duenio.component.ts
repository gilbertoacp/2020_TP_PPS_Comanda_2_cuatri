import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/models/utils';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Duenio } from 'src/app/models/duenio';
import { DuenioSupervisorService } from 'src/app/services/duenio-supervisor.service';
import { Supervisor } from 'src/app/models/supervisor';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from '../../../services/usuarios.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-alta-duenio',
  templateUrl: './alta-duenio.component.html',
  styleUrls: ['./alta-duenio.component.scss'],
})
export class AltaDuenioComponent implements OnInit {
  nombre: string;
  apellido: string;
  dni: number;
  cuil: string;
  foto_perfil: string;
  clave:string;
  correo:string;
  perfil:string;
  imagen_data:string;

  constructor(private file: File,
    private authService:AuthService,
    private storage:AngularFireStorage,
    private duenio_supervisor_svc:DuenioSupervisorService,
    private usuariosService: UsuariosService,
    private router: Router,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit() { }


  recibir_info(info: any) {
    alert(info)
    const dniData = info.split('@');
    this.nombre = dniData[2];
    this.apellido = dniData[1];
    this.dni = dniData[4];
    let numeroscuit=dniData[8];
    let primero =numeroscuit[0];
    let segundo =numeroscuit[1];
    let ultimo = numeroscuit[2];
    this.cuil = primero+segundo+this.dni+ultimo;
  }

  recibir_foto(foto: any) {
    this.foto_perfil=foto;
  }
  recibir_data(data:any){
    this.imagen_data = data;
  }

  registrar(): void {
    try{
      this.file.readAsArrayBuffer(Utils.getDirectory(this.imagen_data), Utils.getFilename(this.imagen_data))
      .then(async arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
        const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;
        const {data}: any = await this.authService.registerWhithoutPersistance(this.correo, this.clave);

        this.storage.upload(storagePath, blob).then(async task => {
          await this.cargar_perfil(this.perfil,data,task);
          this.notificacionesService.toast('Cargado con exito', 'bottom', 2000, 'success');
          this.router.navigate(['/home']);
        })
        .catch(err => {
          this.notificacionesService.toast(err.message, 'bottom', 2000, 'danger');
          this.notificacionesService.vibrar(1500);
        });
      });
    }
    catch(err) 
    {
      this.notificacionesService.toast(err.message, 'bottom', 2000, 'danger');
    }
  }

  async cargar_perfil(perfil:string,cred:any,task:any){
    if(perfil === 'DUEÑO'){
      const duenio: Duenio = {
        authId: cred.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni.toString(),
        foto: await task.ref.getDownloadURL(),
        cuil: this.cuil
      };

      this.usuariosService.agregarUsuarioConAuthId(cred.uid, {
        correo: this.correo,
        clave: this.clave,
        perfil: PerfilUsuario.DUENIO
      });

      this.duenio_supervisor_svc.agregarDuenio(duenio);
    }
    else{
      const supervisor: Supervisor = {
        authId: cred.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni.toString(),
        foto: await task.ref.getDownloadURL(),
        cuil: this.cuil
      };

      this.usuariosService.agregarUsuarioConAuthId(cred.uid, {
        correo: this.correo,
        clave: this.clave,
        perfil: PerfilUsuario.SUPERVISOR
      });

      this.duenio_supervisor_svc.agregarSupervisor(supervisor);
    }
  }

}
