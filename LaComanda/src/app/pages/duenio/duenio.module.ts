import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DuenioPageRoutingModule } from './duenio-routing.module';

import { DuenioPage } from './duenio.page';
import { QrLectorComponent } from 'src/app/components/qr-lector/qr-lector.component';
import { CameraSelectorComponent } from 'src/app/components/camera-selector/camera-selector.component';
import { AltaDuenioComponent } from './alta-duenio/alta-duenio.component';
import { RegistrosPendientesComponent } from './registros-pendientes/registros-pendientes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DuenioPageRoutingModule
  ],
  declarations: [
    DuenioPage,
    QrLectorComponent,
    CameraSelectorComponent,
    AltaDuenioComponent,
    RegistrosPendientesComponent
  ]
})
export class DuenioPageModule {}
