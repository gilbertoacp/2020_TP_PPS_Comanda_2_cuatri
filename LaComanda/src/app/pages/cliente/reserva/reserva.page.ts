import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar'

import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { IReserva } from 'src/app/models/reserva';
import { ReservasService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  date: string;
  time: string;
  day: string;
  reserva: IReserva;
  idCliente: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  constructor(private alertCtrl: AlertController,private reservaSvc:ReservasService) { }

  onChange($event) {
    this.day = new Date($event._d).toLocaleDateString();
  }

  ngOnInit() {
    this.idCliente = localStorage.getItem('idCliente');
  }



  confirmarReserva() {
    let hours = this.time.split('T')[1];
    hours = hours.split('-')[0];
    let fechaReserva = new Date(this.day + " " + hours);
    this.date = '';
    console.log(fechaReserva);
    this.reserva = {
      idCliente: this.idCliente,
      fecha: fechaReserva,
    }
    let htmlTemplate = `<h4>${fechaReserva}</h4>`;

    console.log(this.reserva);
    this.mostrarConfirm('Su reserva sera: ', htmlTemplate);
  }

  async mostrarConfirm(header?: string, msj?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alerta',
      header: header,
      message: msj,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.reservaSvc.crearReserva(this.reserva).then(()=>{
              console.log('reserva con exito');}
            ).catch(err=>{ console.log(err)})
          }
        }
      ]
    });

    await alert.present();
  }
}
