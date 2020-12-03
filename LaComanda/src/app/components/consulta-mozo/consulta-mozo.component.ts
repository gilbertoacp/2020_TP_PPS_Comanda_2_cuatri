import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavParams } from '@ionic/angular';
import { Cliente } from 'src/app/models/cliente';
import { Mensaje } from 'src/app/models/mensaje';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesa.service';


@Component({
  selector: 'app-consulta-mozo',
  templateUrl: './consulta-mozo.component.html',
  styleUrls: ['./consulta-mozo.component.scss'],
})
export class ConsultaMozoComponent implements OnInit {

  mesa: Mesa;
  mensajeActual: string;
  cliente: Cliente;
  @ViewChild(IonContent) content: IonContent;

  chat: Mensaje[];
  
  mensaje: Mensaje;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private mesaService: MesaService
  ) { }

  ngOnInit() {
    this.cliente = this.navParams.get('cliente')?? null;
    this.mesa = this.navParams.get('mesa') as Mesa?? null;

    window.onkeyup = ({keyCode}) => keyCode === 13? this.enviarConsulta(): null; 

    this.mesaService.chatMesa(this.mesa.docId).subscribe(chat => {
      this.chat = chat;
      this.scrollToBottom();
    });

    this.scrollToBottom(true);
  }

  enviarConsulta() {
    this.mensaje = {
      fecha: new Date(),
      contenido: this.mensajeActual,
      docIdCliente: this.cliente.docId,
      docIdMesa: this.mesa.docId,
      nombreCliente: this.cliente.nombre,
      numeroMesa: this.mesa.numero
    }

    this.mesaService.enviarConsulta(this.mesa, this.mensaje);
    this.mensaje = null;
    this.mensajeActual = '';
  }


  private scrollToBottom(firstTime = false) {
    firstTime? 
    setTimeout(() => this.content.scrollToBottom(1000),1500): 
    setTimeout(() => this.content.scrollToBottom(200), 200);
  }

}
