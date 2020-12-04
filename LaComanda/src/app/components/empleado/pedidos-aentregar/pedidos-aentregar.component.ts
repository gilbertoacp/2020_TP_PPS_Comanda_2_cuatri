import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Tarea } from 'src/app/models/tarea';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-pedidos-aentregar',
  templateUrl: './pedidos-aentregar.component.html',
  styleUrls: ['./pedidos-aentregar.component.scss'],
})
export class PedidosAEntregarComponent implements OnInit {

  subscriptions: Subscription[] = [];
  tareasCompletadas: Tarea[];

  constructor(
    private modalCtrl: ModalController,
    private pedidosService: PedidosService
  ) { }

  ngOnInit() {
    this.pedidosService.tareasCompletadas.subscribe(tareas => {
      this.tareasCompletadas = tareas;
    });
  }

  entregarPedido(tarea: Tarea) {
    
  }

  cerrar(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.modalCtrl.dismiss();
  }

}
