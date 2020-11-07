import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteGuard } from 'src/app/guards/cliente.guard';
import { DuenioGuard } from 'src/app/guards/duenio.guard';
import { EmpleadoGuard } from 'src/app/guards/empleado.guard';
import { HomeGuard } from 'src/app/guards/home.guard';
import { SupervisorGuard } from 'src/app/guards/supervisor.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [HomeGuard],
  },
  {
    path: 'duenio',
    loadChildren: () => import('../duenio/duenio.module').then( m => m.DuenioPageModule),
    canActivate: [DuenioGuard]
  },
  {
    path: 'empleado',
    loadChildren: () => import('../empleado/empleado.module').then( m => m.EmpleadoPageModule),
    canActivate: [EmpleadoGuard]
  },
  {
    path: 'supervisor',
    loadChildren: () => import('../supervisor/supervisor.module').then( m => m.SupervisorPageModule),
    canActivate: [SupervisorGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('../cliente/cliente.module').then( m => m.ClientePageModule),
    canActivate: [ClienteGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
