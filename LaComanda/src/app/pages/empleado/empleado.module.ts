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
import { ListaDeEsperaMetreClienteComponent } from './lista-de-espera-metre-cliente/lista-de-espera-metre-cliente.component';
import { ResponderConsultasComponent } from './responder-consultas/responder-consultas.component';
import { RespuestaMozoComponent } from 'src/app/components/respuesta-mozo/respuesta-mozo.component';
import { PedidosPendientesComponent } from 'src/app/components/empleado/pedidos-pendientes/pedidos-pendientes.component';
import { ListaTareasComponent } from 'src/app/components/empleado/lista-tareas/lista-tareas.component';

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
    HacerPedidoComponent,
    ListaDeEsperaMetreClienteComponent,
    ResponderConsultasComponent,
    RespuestaMozoComponent,
    PedidosPendientesComponent,
    ListaTareasComponent
  ]
})
export class EmpleadoPageModule {}
