import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-lista-de-espera-metre-cliente',
  templateUrl: './lista-de-espera-metre-cliente.component.html',
  styleUrls: ['./lista-de-espera-metre-cliente.component.scss'],
})
export class ListaDeEsperaMetreClienteComponent implements OnInit {

  clientesEnEspera: Cliente[];

  listado: any;
  mesasLibres: any;
  constructor(
    private clientesService: ClientesService,
    private mesaService: MesaService,
  ) { }


  ngOnInit()
  {
    this.clientesService.clientesEnListaDeEspera().subscribe(clientes => this.clientesEnEspera = clientes);
    this.obtenerMesasLibres();
  }

  cancelarCliente(cliente: Cliente): void {
    this.clientesService.cambiarEstadoDelCliente(cliente, false);
  }

  obtenerMesasLibres() {
    this.mesaService.getMesasLibre().subscribe(listado => {
      this.mesasLibres = listado;
    });
  }

  // FALTARIA ASIGNAR LA MESA (CON EL USUARIO) Y CREAR EL PEDIDO DEL USUARIO

  //asignarMesa(c)

  //cancelarCliente(c)

  //crearPedido

}
