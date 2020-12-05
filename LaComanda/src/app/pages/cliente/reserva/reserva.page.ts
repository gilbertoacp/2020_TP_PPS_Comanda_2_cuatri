import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar'

import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  date: string;
  time: string;
  day: string;
  subscription: Subscription;
  cliente: Cliente;
  fecha: Date;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  constructor(private alertCtrl: AlertController,private clienteService:ClientesService, private authService: AuthService) { }

  onChange($event) {
    this.day = new Date($event._d).toLocaleDateString();
  }

  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
      if (cliente) {
        this.cliente = cliente[0];
      } 
      console.log(this.cliente);
    });
  }



  confirmarReserva() {
    let hours = this.time.split('T')[1];
    hours = hours.split('-')[0];
    let fechaReserva = new Date(this.day + " " + hours);
    this.date = '';
    this.cliente.horaReserva = fechaReserva.toString();
    console.log(fechaReserva);
    console.log('hora cliente: ' + this.cliente.horaReserva);
    let htmlTemplate = `<h4>${fechaReserva}</h4>`;
    this.mostrarConfirm('Su reserva sera: ', htmlTemplate);
  }

  async mostrarConfirm(header?: string, msj?: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alerta',
      header: header,
      message: msj,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.clienteService.asignarReserva(this.cliente);
          }
        }
      ]
    });

    await alert.present();
  }
}
