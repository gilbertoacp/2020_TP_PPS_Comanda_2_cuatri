import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaEmpleadoPageRoutingModule } from './alta-empleado-routing.module';

import { AltaEmpleadoPage } from './alta-empleado.page';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaEmpleadoPageRoutingModule,
    
  ],
  declarations: [AltaEmpleadoPage, SpinnerComponent]
})
export class AltaEmpleadoPageModule {}
