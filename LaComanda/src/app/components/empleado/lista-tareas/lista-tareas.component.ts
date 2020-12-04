import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Tarea } from 'src/app/models/tarea';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.scss'],
})
export class ListaTareasComponent implements OnInit {

  subscriptions: Subscription[] = [];
  tareas: Tarea[];
  tipo = ''

  constructor(
    private pedidosService: PedidosService,
    private navParams: NavParams,
    public modalCtrl: ModalController
  ) { } 

  ngOnInit() {
    this.tipo = this.navParams.get('tipo') ?? null;
    
    this.subscriptions.push(
      this.pedidosService.tareas.subscribe(tareas => {
        this.tareas = tareas;
        console.log(this.tareas);
        
      })
    );
  }

  completarTarea(tarea: Tarea) {
    if(this.tipo === 'cocinero') {
      tarea.platos.completado = true;
    }

    if(this.tipo === 'bartender') {
      tarea.bebidas.completado = true;
    }

    if(tarea.bebidas.completado && tarea.platos.completado) {
      tarea.listoParaEntregar = true;
      this.pedidosService.pedidoListo(tarea.docId);
    }

    this.pedidosService.completarTarea(tarea);
  }

  cerrar(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.modalCtrl.dismiss();
  }

}
