import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestasService } from '../../../services/encuestas.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { Empleado } from '../../../models/empleado';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

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
    private encuestasService: EncuestasService,
    private empleadosService: EmpleadosService,
    private notificacionesService: NotificacionesService
  ) { 
    if(this.router.getCurrentNavigation().extras.state.empleado) {
      this.empleado = this.router.getCurrentNavigation().extras.state.empleado;
    }
  }

  ngOnInit() {
  }

  async registrarEncuesta(): Promise<void> {

    if(!(this.calificacionGrupoTrabajo && this.feedback && this.estadoInstalaciones)) {
      this.notificacionesService.toast('Error!, Debe llenar los campos primeros!s','bottom',1500,'warning');
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

      this.notificacionesService.toast('Se ha cargado la encuesta!','bottom',1500,'success');
    } catch(err) {

      this.notificacionesService.toast('Fallo al cargar la encuesta!','bottom',1500,'success');

    } finally {
      this.enEspera = false;
      this.feedback = null;
      this.estadoInstalaciones = null;
      this.calificacionGrupoTrabajo = null;
      this.cerrar();
    }

  }

  cerrar(): void {
    this.router.navigate(['/home/empleado']);
  }
}
