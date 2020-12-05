import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';
import { Subscription } from 'rxjs';
import { Mesa } from 'src/app/models/mesa';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reservas-pendientes',
  templateUrl: './reservas-pendientes.component.html',
  styleUrls: ['./reservas-pendientes.component.scss'],
})
export class ReservasPendientesComponent implements OnInit {

  mesasLibres: Mesa[];
  clientesConReserva: Cliente[];
  subscriptions: Subscription[] = [];
  clienteSeleccionado : Cliente;

  constructor(
    private clientesService: ClientesService,
    private mesaService: MesaService,
    public alertController: AlertController
  ) { }

  ngOnInit()
  {
    this.subscriptions.push(
      this.clientesService.clientesConReserva().subscribe(clientes => {
        this.clientesConReserva = clientes; 
      }),
      this.mesaService.getMesasLibre().subscribe(listado => {
        this.mesasLibres = listado;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelarReserva(cliente: Cliente): void {
    this.clientesService.cancelarReserva(cliente);
  }

  asignarMesa(cliente : Cliente) {
    this.clienteSeleccionado = cliente;

    const tipoMesa = {
      0: 'Normal',
      1: 'VIP',
      2: 'Discapacitados'
    }
    
    const radios = this.mesasLibres
    .sort((m1,m2) => m1.numero - m2.numero)
    .map(m => {
      return {
        name: 'radio2',
        type: 'radio',
        label: `Nº ${m.numero} - ${m.cantidad} personas - ${tipoMesa[m.tipo]}`,
        value: m.docId
      }
    });

    this.mostrarMesasDisponiblesAlert(radios);
  }

  async mostrarMesasDisponiblesAlert(radios: any) {
    const alert = await this.alertController.create({
      cssClass: 'alert-asignar-mesa',
      header: 'Mesas Disponibles',
      inputs: radios,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, 
        {
          text: 'Ok',
          handler: (data) => {
            this.mesaService.asignarMesaACliente(data, this.clienteSeleccionado.docId);
          }
        }
      ],
    });
    await alert.present();
  }
}
