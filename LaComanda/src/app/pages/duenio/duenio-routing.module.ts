import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaDuenioComponent } from './alta-duenio/alta-duenio.component';
import { AltaMesaComponent } from './alta-mesa/alta-mesa.component';

import { DuenioPage } from './duenio.page';
import { RegistrosPendientesComponent } from './registros-pendientes/registros-pendientes.component';
import { ReservasPendientesComponent } from './reservas-pendientes/reservas-pendientes.component';

const routes: Routes = [
  {
    path: '',
    component: DuenioPage,
  },
  {
    path: 'alta',
    component: AltaDuenioComponent,
  },
  {
    path: 'alta-empleado',
    loadChildren: () => import('../alta-empleado/alta-empleado.module').then( m => m.AltaEmpleadoPageModule)
  },
  {
    path: 'registros-pendientes',
    component: RegistrosPendientesComponent
  },
  {
    path: 'reservas-pendientes',
    component: ReservasPendientesComponent
  },
  {
    path: 'alta-mesa',
    component: AltaMesaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuenioPageRoutingModule {}
