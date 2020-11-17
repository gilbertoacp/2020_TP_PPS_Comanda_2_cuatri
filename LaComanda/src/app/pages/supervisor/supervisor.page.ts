import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private authService: AuthService, private actionSheetCtlr:ActionSheetController) { }
  
  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.SUPERVISOR)
    .subscribe(supervisor => {
      console.log(supervisor[0]);
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
