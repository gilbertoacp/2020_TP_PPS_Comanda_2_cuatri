import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaDuenioComponent } from './alta-duenio/alta-duenio.component';

import { DuenioPage } from './duenio.page';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuenioPageRoutingModule {}
