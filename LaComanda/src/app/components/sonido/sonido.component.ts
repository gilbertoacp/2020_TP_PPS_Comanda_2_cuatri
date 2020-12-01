import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonFabButton, IonIcon } from '@ionic/angular';
import Draggabilly from 'draggabilly';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-sonido',
  templateUrl: './sonido.component.html',
  styleUrls: ['./sonido.component.scss'],
})
export class SonidoComponent implements OnInit, AfterViewInit {

  @ViewChild(IonFabButton) boton;
  @ViewChild(IonIcon) icono;

  constructor(private notificacionesService: NotificacionesService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if(localStorage.getItem('audio')) {
      this.icono.el.name = 'volume-off-outline';
    }

    new Draggabilly(this.boton.el,{containment: '.app'});
  }

  toggleSound(): void {
    if(this.icono.el.name === 'volume-medium-outline') {
      this.notificacionesService.desactivarAudio();
      this.icono.el.name = 'volume-off-outline';
    }
    else {
      this.notificacionesService.reactivarAudio();
      this.icono.el.name = 'volume-medium-outline';
    }
  }
}
