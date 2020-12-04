import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
})
export class PedidosPendientesComponent implements OnInit {

  pedidos: Pedido[];

  constructor(private pedidosService: PedidosService) { }

  ngOnInit() {
    this.pedidosService.pedidosPendientes.subscribe(pedidos => {
      console.log(pedidos);
      
      this.pedidos = pedidos;
    });
  }

  confirmarPedido(pedido: Pedido): void {
    this.pedidosService.confirmarPedido(pedido);
  }

}
