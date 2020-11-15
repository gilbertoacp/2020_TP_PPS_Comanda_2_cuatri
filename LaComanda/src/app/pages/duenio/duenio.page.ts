import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-duenio',
  templateUrl: './duenio.page.html',
  styleUrls: ['./duenio.page.scss'],
})
export class DuenioPage implements OnInit {

  constructor(
    private actionSheetCtlr: ActionSheetController,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
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
