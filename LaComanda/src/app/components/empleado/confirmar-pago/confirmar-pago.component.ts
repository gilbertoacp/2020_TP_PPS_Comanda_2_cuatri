import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-confirmar-pago',
  templateUrl: './confirmar-pago.component.html',
  styleUrls: ['./confirmar-pago.component.scss'],
})
export class ConfirmarPagoComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  pedidos: Pedido[];


  constructor(
    private pedidosService: PedidosService,
    private clientesService: ClientesService,
    private mesasService: MesaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pedidosService.pagosAConfirmar().subscribe(pedidos => {
      this.pedidos = pedidos;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  confirmarPago(pedido: Pedido): void {
    try {
      this.pedidosService.confirmarPago(pedido.docId);
      this.mesasService.liberarMesa(pedido.docIdMesa);
      this.clientesService.liberarCliente(pedido.docIdCliente);

      this.router.navigate(['/home']);
    } catch(err) {
      console.log(err);
    }
  }

}
