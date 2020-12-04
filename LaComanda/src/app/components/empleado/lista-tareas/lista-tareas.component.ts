import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tarea } from 'src/app/models/tarea';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.scss'],
})
export class ListaTareasComponent implements OnInit {

  tareas: Tarea[];
  tipo = ''


  constructor(private pedidosService: PedidosService,
    private router: Router) { }

  ngOnInit() {
    this.tipo = this.router.getCurrentNavigation().extras.state.tipo ?? null;
    console.log(this.tipo);
    
    this.pedidosService.tareas.subscribe(tareas => {
      this.tareas = tareas;
    });
  }

  completar(tarea: Tarea) {
    console.log('Checkeado');
    
    // console.log(tarea);
  }

}
