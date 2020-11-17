import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'firebase';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
})
export class EmpleadoPage implements OnInit, OnDestroy {

  empleado: Empleado;
  private subscription: Subscription;

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
  ) { }
  
  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.EMPLEADO)
    .subscribe(empleado => {
      if(empleado) {
        this.empleado = empleado[0];
        console.log(this.empleado);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  presentActionSheet(): void {
    this.actionSheetCtlr.create({
      buttons: [{
        text: 'Cerrar sesión',
        icon: 'log-out',
        handler: () => {
          this.authService.logout();
        }
      }]
    })
    .then(a => a.present());
  }
}
