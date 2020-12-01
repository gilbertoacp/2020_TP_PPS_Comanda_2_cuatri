import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPageRoutingModule {}
