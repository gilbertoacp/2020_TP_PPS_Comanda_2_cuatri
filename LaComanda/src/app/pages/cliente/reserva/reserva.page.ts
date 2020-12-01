import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar'

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  date: string;
  time:string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  constructor() { }
 
  onChange($event) {
    this.date =new Date($event._d).toLocaleDateString();
  }

  ngOnInit() {
  }
  
  confirmarReserva(){
    let hours = this.time.split('T')[1];
    hours = hours.split('-')[0];
    let fechaReserva = new Date(this.date +" "+ hours);
    console.log(fechaReserva);
  }
}
