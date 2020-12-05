import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuenioPageRoutingModule } from './duenio-routing.module';

import { DuenioPage } from './duenio.page';
import { QrLectorComponent } from 'src/app/components/qr-lector/qr-lector.component';
import { CameraSelectorComponent } from 'src/app/components/camera-selector/camera-selector.component';
import { AltaDuenioComponent } from './alta-duenio/alta-duenio.component';
import { RegistrosPendientesComponent } from './registros-pendientes/registros-pendientes.component';
import { ReservasPendientesComponent } from './reservas-pendientes/reservas-pendientes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuenioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    DuenioPage,
    QrLectorComponent,
    CameraSelectorComponent,
    AltaDuenioComponent,
    RegistrosPendientesComponent,
    ReservasPendientesComponent
  ]
})
export class DuenioPageModule {}
