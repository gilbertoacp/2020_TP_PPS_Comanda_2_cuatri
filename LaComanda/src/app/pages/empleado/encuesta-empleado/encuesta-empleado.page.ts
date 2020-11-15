import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EncuestaEmpleadoService } from 'src/app/services/empleado/encuesta-empleado.service';

@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

  estadoInstalaciones: string;
  calificacionGrupoTrabajo: number;
  feedback: string;
  enEspera: boolean = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private encuestasEmpleadoService: EncuestaEmpleadoService,
  ) { }

  ngOnInit() {
  }

  async registrarEncuesta(): Promise<void> {
    if(
      !(this.calificacionGrupoTrabajo && 
      this.feedback &&
      this.estadoInstalaciones)
    ) {
      this.presentToast('Error!, Debe llenar los campos primeros');
      return;
    }

    this.enEspera = true;

    try {
      await this.encuestasEmpleadoService.agregarEncuesta({
        // docIdEmpleado: '213213',
        estadoInstalaciones: this.estadoInstalaciones,
        calificacionGrupoTrabajo: this.calificacionGrupoTrabajo,
        feedback: this.feedback
      });

      this.presentToast('Se ha cargado la encuesta!');
    } catch(err) {
      this.presentToast('Error, No se ha podido cargar la encuesta!');
      console.log(err);
    } finally {
      this.enEspera = false;
      this.cerrarEncuesta();
    }
  }

  async presentToast(msj: string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }

  cerrarEncuesta(): void {
    this.router.navigate(['..']);
  }
}
