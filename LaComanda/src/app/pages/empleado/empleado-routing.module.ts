import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoPage } from './empleado.page';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';
import { ListaDeEsperaMetreClienteComponent } from './lista-de-espera-metre-cliente/lista-de-espera-metre-cliente.component';
import { ResponderConsultasComponent } from './responder-consultas/responder-consultas.component';
import { PedidosPendientesComponent } from 'src/app/components/empleado/pedidos-pendientes/pedidos-pendientes.component';
import { ListaTareasComponent } from 'src/app/components/empleado/lista-tareas/lista-tareas.component';
import { PedidosAEntregarComponent } from 'src/app/components/empleado/pedidos-aentregar/pedidos-aentregar.component';
import { ConfirmarPagoComponent } from 'src/app/components/empleado/confirmar-pago/confirmar-pago.component';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoPage
  },
  {
    path: 'encuesta-empleado',
    loadChildren: () => import('./encuesta-empleado/encuesta-empleado.module').then( m => m.EncuestaEmpleadoPageModule)
  },
  {
    path: 'alta-producto',
    component: AltaProductoComponent
  },
  {
    path: 'lista-espera-metre-cliente',
    component: ListaDeEsperaMetreClienteComponent
  },
  {
    path: 'consultas-clientes',
    component: ResponderConsultasComponent
  },
  {
    path: 'pedidos-pendientes',
    component: PedidosPendientesComponent
  },
  {
    path: 'pedidos-entregar',
    component: PedidosAEntregarComponent
  },
  {
    path: 'confirmar-pagos',
    component: ConfirmarPagoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoPageRoutingModule {}
