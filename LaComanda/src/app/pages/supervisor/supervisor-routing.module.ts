import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaDuenioComponent } from '../duenio/alta-duenio/alta-duenio.component';
import { RegistrosPendientesComponent } from '../duenio/registros-pendientes/registros-pendientes.component';

import { SupervisorPage } from './supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorPage
  },
  {
    path: 'alta-empleado',
    loadChildren: () => import('../alta-empleado/alta-empleado.module').then( m => m.AltaEmpleadoPageModule)
  },
  {
    path: 'alta',
    component: AltaDuenioComponent,
  },
  {
    path: 'registros-pendientes',
    component: RegistrosPendientesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorPageRoutingModule {}
