import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-de-espera-metre-cliente',
  templateUrl: './lista-de-espera-metre-cliente.component.html',
  styleUrls: ['./lista-de-espera-metre-cliente.component.scss'],
})
export class ListaDeEsperaMetreClienteComponent implements OnInit {

  constructor(public router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {}

}
