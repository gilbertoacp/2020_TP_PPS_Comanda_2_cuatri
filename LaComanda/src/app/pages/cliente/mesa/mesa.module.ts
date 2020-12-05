import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaPageRoutingModule } from './mesa-routing.module';

import { MesaPage } from './mesa.page';
import { HacerPedidoComponent } from 'src/app/components/hacer-pedido/hacer-pedido.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ConsultaMozoComponent } from 'src/app/components/consulta-mozo/consulta-mozo.component';
import { SolicitarCuentaComponent } from 'src/app/components/solicitar-cuenta/solicitar-cuenta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaPageRoutingModule
  ],
  declarations: [
    MesaPage, 
    HacerPedidoComponent, 
    SpinnerComponent,
    ConsultaMozoComponent,
    SolicitarCuentaComponent
  ]
})
export class MesaPageModule {}
