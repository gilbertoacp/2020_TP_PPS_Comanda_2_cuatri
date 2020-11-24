import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-registros-pendientes',
  templateUrl: './registros-pendientes.component.html',
  styleUrls: ['./registros-pendientes.component.scss'],
})
export class RegistrosPendientesComponent implements OnInit {

  clientesSinAprobar: Cliente[];

  constructor(
    public router: Router,
    private clientesService: ClientesService
  ) { }

  ngOnInit() {
    this.clientesService.clienteSinAprobar().subscribe(clientes => {
      this.clientesSinAprobar = clientes;
    });
  }

  cambiarEstado(cliente: Cliente, aceptado: boolean): void {
    this.clientesService.cambiarEstadoDelRegistro(cliente, aceptado);
  }
}
