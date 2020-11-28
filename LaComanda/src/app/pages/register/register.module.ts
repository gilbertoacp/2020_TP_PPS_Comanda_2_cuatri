import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [RegisterPage, SpinnerComponent]
})
export class RegisterPageModule {}
