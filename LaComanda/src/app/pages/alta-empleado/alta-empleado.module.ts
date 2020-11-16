import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaEmpleadoPageRoutingModule } from './alta-empleado-routing.module';

import { AltaEmpleadoPage } from './alta-empleado.page';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CameraSelectorComponent } from 'src/app/components/camera-selector/camera-selector.component';
import { QrLectorComponent } from 'src/app/components/qr-lector/qr-lector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaEmpleadoPageRoutingModule,
    
  ],
  declarations: [AltaEmpleadoPage, SpinnerComponent, CameraSelectorComponent, QrLectorComponent]
})
export class AltaEmpleadoPageModule {}
