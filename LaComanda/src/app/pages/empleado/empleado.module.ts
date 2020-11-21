import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadoPageRoutingModule } from './empleado-routing.module';

import { EmpleadoPage } from './empleado.page';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TipoEmpleadoPipe } from '../../pipes/tipo-empleado.pipe';
import { HacerPedidoComponent } from '../../components/hacer-pedido/hacer-pedido.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleadoPageRoutingModule
  ],
  declarations: [
    EmpleadoPage, 
    AltaProductoComponent, 
    SpinnerComponent, 
    TipoEmpleadoPipe, 
    HacerPedidoComponent
  ]
})
export class EmpleadoPageModule {}
