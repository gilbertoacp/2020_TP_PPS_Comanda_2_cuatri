import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ConsultaMozoComponent } from 'src/app/components/consulta-mozo/consulta-mozo.component';
import { RespuestaMozoComponent } from 'src/app/components/respuesta-mozo/respuesta-mozo.component';
import { Empleado } from 'src/app/models/empleado';
import { Mensaje } from 'src/app/models/mensaje';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-responder-consultas',
  templateUrl: './responder-consultas.component.html',
  styleUrls: ['./responder-consultas.component.scss'],
})
export class ResponderConsultasComponent implements OnInit {

  mozo: Empleado;
  chats: Array<Mensaje[]>;

  constructor(
    private mesasService: MesaService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.mozo = this.router.getCurrentNavigation().extras.state.mozo?? null;

    this.mesasService.getChatsMesas().subscribe(chats => {
      this.chats = chats.sort((m1, m2) => {
        if(!m1[0].docIdCliente && m2[0].docIdCliente) {
          return 1; 
        }

        if(!m2[0].docIdCliente && m1[0].docIdCliente) {
          return -1;
        }

        if(m1 && m2) {
          return m1[0].numeroMesa - m2[0].numeroMesa;
        }
      });                       
    })
  }

  async irAlChat(docIdMesa: string): Promise<void> {
    const m = await this.modalCtrl.create({
      component: RespuestaMozoComponent,
      componentProps: {
        mozo: this.mozo,
        docIdMesa
      }
    });

    m.present();
  }

}
