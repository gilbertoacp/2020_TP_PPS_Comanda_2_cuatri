import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-duenio',
  templateUrl: './duenio.page.html',
  styleUrls: ['./duenio.page.scss'],
})
export class DuenioPage implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.DUENIO)
    .subscribe(duenio => {
      console.log(duenio[0]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 recibir_info(info:any){
   alert(info)
 }
 
 recibir_foto(foto:any){
   alert(foto);
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
