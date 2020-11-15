import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoPage } from './empleado.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoPage
  },
  {
    path: 'encuesta-empleado',
    loadChildren: () => import('./encuesta-empleado/encuesta-empleado.module').then( m => m.EncuestaEmpleadoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoPageRoutingModule {}
