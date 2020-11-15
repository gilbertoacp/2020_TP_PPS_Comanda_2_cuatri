import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
})
export class EmpleadoPage implements OnInit {

  authUser: User;

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(u => {
      console.log(u);
    })
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
