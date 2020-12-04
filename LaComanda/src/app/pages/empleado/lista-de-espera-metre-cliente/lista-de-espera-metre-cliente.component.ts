import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';
import { Subscription } from 'rxjs';
import { Mesa } from 'src/app/models/mesa';
import { PedidosService } from 'src/app/services/pedidos.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-de-espera-metre-cliente',
  templateUrl: './lista-de-espera-metre-cliente.component.html',
  styleUrls: ['./lista-de-espera-metre-cliente.component.scss'],
})
export class ListaDeEsperaMetreClienteComponent implements OnInit, OnDestroy {

  mesasLibres: Mesa[];
  clientesEnEspera: Cliente[];
  subscriptions: Subscription[] = [];
  clienteSeleccionado : Cliente;
  
  constructor(
    private clientesService: ClientesService,
    private mesaService: MesaService,
    private pedidoService: PedidosService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.clientesService.clientesEnListaDeEspera().subscribe(clientes => {
        this.clientesEnEspera = clientes; 
      }),
      this.mesaService.getMesasLibre().subscribe(listado => {
        this.mesasLibres = listado;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelarCliente(cliente: Cliente): void {
    this.clientesService.cambiarEstadoDelCliente(cliente, false);
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
