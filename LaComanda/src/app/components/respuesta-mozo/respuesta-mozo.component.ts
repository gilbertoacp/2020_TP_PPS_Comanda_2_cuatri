import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavParams } from '@ionic/angular';
import { Empleado } from 'src/app/models/empleado';
import { Mensaje } from 'src/app/models/mensaje';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-respuesta-mozo',
  templateUrl: './respuesta-mozo.component.html',
  styleUrls: ['./respuesta-mozo.component.scss'],
})
export class RespuestaMozoComponent implements OnInit {

  mensajeActual: string;
  mozo: Empleado;
  chat: Mensaje[];
  mensaje: Mensaje;
  docIdMesa: string;
  @ViewChild(IonContent) content: IonContent;


  constructor(
    public modalCtrl: ModalController,
    private mesasService: MesaService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.mozo = this.navParams.get('mozo');
    this.docIdMesa = this.navParams.get('docIdMesa');

    this.mesasService.chatMesa(this.docIdMesa).subscribe(chat => {
      this.chat = chat
      this.scrollToBottom();
    });

    this.scrollToBottom(true);
  }

  enviarRespuesta(): void {
    this.mensaje = {
      fecha: new Date(),
      contenido: this.mensajeActual,
      docIdMesa: this.docIdMesa,
      docIdMozo: this.mozo.docId,
      nombreMozo: this.mozo.nombre
    }

    this.mesasService.responderConsulta(this.docIdMesa, this.mensaje);
    this.mensaje = null;
    this.mensajeActual = '';
  }

  private scrollToBottom(firstTime = false) {
    firstTime? 
    setTimeout(() => this.content.scrollToBottom(1000),1500): 
    setTimeout(() => this.content.scrollToBottom(200), 200);
  }
}
