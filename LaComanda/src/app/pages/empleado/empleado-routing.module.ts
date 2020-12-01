import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoPage } from './empleado.page';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';
import { ListaDeEsperaMetreClienteComponent } from './lista-de-espera-metre-cliente/lista-de-espera-metre-cliente.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoPageRoutingModule {}
