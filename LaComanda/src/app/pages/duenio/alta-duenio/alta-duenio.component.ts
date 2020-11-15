import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/models/utils';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Duenio } from 'src/app/models/duenio';
import { DuenioSupervisorService } from 'src/app/services/duenio-supervisor.service';
import { Supervisor } from 'src/app/models/supervisor';
import { ToastController } from '@ionic/angular';

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
    private toastController:ToastController) { }

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
      .then(arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
        const storagePath = `images/${new Date().toLocaleDateString().split('/').join('-')}__${Math.random().toString(36).substring(2)}`;
  
        this.authService.register(this.correo, this.clave).then(cred => {
          this.storage.upload(storagePath, blob).then(async task => {
            await this.cargar_perfil(this.perfil,cred,task);
            this.presentToast('Cargado con exito','success')
          })
          .catch(err => {
            this.presentToast(err,'danger')
          });
        });
      });
    }
    catch(err) 
    {
      this.presentToast(err,'danger');
    }
  }

  async cargar_perfil(perfil:string,cred:any,task:any){
    if(perfil === 'DUEÑO'){
      const duenio: Duenio = {
        authId: cred.user.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni.toString(),
        foto: await task.ref.getDownloadURL(),
        cuil: this.cuil
      };
      this.duenio_supervisor_svc.agregarDuenio(duenio);
    }
    else{
      const supervisor: Supervisor = {
        authId: cred.user.uid,
        nombre: this.nombre,
        apellido: this.apellido,
        dni: this.dni.toString(),
        foto: await task.ref.getDownloadURL(),
        cuil: this.cuil
      };
      this.duenio_supervisor_svc.agregarSupervisor(supervisor);
    }

  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
