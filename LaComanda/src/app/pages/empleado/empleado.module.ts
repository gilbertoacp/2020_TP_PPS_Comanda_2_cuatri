import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadoPageRoutingModule } from './empleado-routing.module';

import { EmpleadoPage } from './empleado.page';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleadoPageRoutingModule
  ],
  declarations: [EmpleadoPage, AltaProductoComponent]
})
export class EmpleadoPageModule {}
