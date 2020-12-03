import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConsultaMozoComponent } from 'src/app/components/consulta-mozo/consulta-mozo.component';
import { HacerPedidoComponent } from 'src/app/components/hacer-pedido/hacer-pedido.component';
import { Cliente } from 'src/app/models/cliente';
import { Mesa } from 'src/app/models/mesa';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { AuthService } from 'src/app/services/auth.service';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
})
export class MesaPage implements OnInit {

  subscriptions: Subscription[] = [];
  cliente: Cliente;
  mesa: Mesa;

  constructor(
    private mesasService: MesaService,
    public authService: AuthService,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit(): Promise<void> {
    const subject = new Subject<void>();

    this.subscriptions.push(
      this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
        if(cliente) {
          this.cliente = cliente[0];
          subject.next();
        }
      })
    );

    try {
      await subject.asObservable().pipe(take(1)).toPromise();

      this.subscriptions.push(
        this.mesasService.traerMesaCliente(this.cliente).subscribe(mesa => {
          if(mesa) {
            console.log(mesa);
            
            this.mesa = mesa[0];
          }
        })
      );

    } catch(err) {

      throw err;

    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async pedirProductos(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: HacerPedidoComponent,
      componentProps:  {
        cliente: this.cliente
      }
    });

    modal.present();
  }

  async consultaAlMozo(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ConsultaMozoComponent,
      componentProps:  {
        cliente: this.cliente,
        mesa: this.mesa
      }
    });

    modal.present();
  }
}
