import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EncuestasService } from '../../../services/encuestas.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { Empleado } from '../../../models/empleado';

@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

  empleado: Empleado;
  estadoInstalaciones: string;
  calificacionGrupoTrabajo: number;
  feedback: string;
  enEspera: boolean = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private encuestasService: EncuestasService,
    private empleadosService: EmpleadosService
  ) { 
    if(this.router.getCurrentNavigation().extras.state.empleado) {
      this.empleado = this.router.getCurrentNavigation().extras.state.empleado;
    }
  }

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
      const encuesta = {
        docIdEmpleado: this.empleado.docId,
        estadoInstalaciones: this.estadoInstalaciones,
        calificacionGrupoTrabajo: this.calificacionGrupoTrabajo,
        feedback: this.feedback
      };

      this.encuestasService.guardarEncuestaEmpleado(encuesta);
      
      this.empleadosService.agregarEncuesta(encuesta);

      this.presentToast('Se ha cargado la encuesta!');
    } catch(err) {
      this.presentToast('Error, No se ha podido cargar la encuesta!');

      console.log(err);
    } finally {
      this.enEspera = false;
      this.feedback = null;
      this.estadoInstalaciones = null;
      this.calificacionGrupoTrabajo = null;
      this.cerrar();
    }
  }

  async presentToast(msj: string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }

  cerrar(): void {
    this.router.navigate(['/home/empleado']);
  }
}
