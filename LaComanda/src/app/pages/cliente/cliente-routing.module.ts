import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientePage } from './cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ClientePage
  },  {
    path: 'finalizados',
    loadChildren: () => import('./finalizados/finalizados.module').then( m => m.FinalizadosPageModule)
  },
  {
    path: 'lista-espera',
    loadChildren: () => import('./lista-espera/lista-espera.module').then( m => m.ListaEsperaPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'reserva',
    loadChildren: () => import('./reserva/reserva.module').then( m => m.ReservaPageModule)
  },
  {
    path: 'mesa',
    loadChildren: () => import('./mesa/mesa.module').then( m => m.MesaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientePageRoutingModule {}
