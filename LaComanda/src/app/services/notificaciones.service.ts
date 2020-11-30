import { Injectable } from '@angular/core';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Howl, Howler } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private audio: Howl = null;

  constructor(
    private localNotifications: LocalNotifications,
    private vibration : Vibration,
    private toastController: ToastController,
    private alertController: AlertController
  ) { 
    if(localStorage.getItem('audio')) {
      this.desactivarAudio();
    }
  }

  private audioFinalizado(): void {
    this.audio.on('end', () => {
      this.audio = null;
    });
  }

  private reproducirAudio(path: string): void {
    this.audio = new Howl({src: path});
    this.audio.play();
    this.audioFinalizado();
  }

  vibrar(tiempo: number = 500): void {
    this.vibration.vibrate(tiempo);
  }

  burbuja(): void {
    this.reproducirAudio('assets/audio/bubble.mp3');
  }

  error(): void {
    this.reproducirAudio('assets/audio/login/sonidoBotonERROR.mp3')
  }

  exito(): void {
    this.reproducirAudio('assets/audio/login/sonidoBotonSUCESS.mp3')
  }

  desactivarAudio(): void {
    if(!localStorage.getItem('audio')) {
      localStorage.setItem('audio', 'muteado');
    }

    Howler.mute(true);
  }

  reactivarAudio(): void {
    if(localStorage.getItem('audio')) {
      localStorage.removeItem('audio');
    }

    Howler.mute(false);
  }

  push(titulo: string, mensaje?: string, iconoPath?: string): void {
    this.localNotifications.schedule({
      title: titulo,
      text: mensaje,
      icon: iconoPath,
      trigger: {
        in: 0.5, 
        unit: ELocalNotificationTriggerUnit.SECOND 
      },
    });
  }

  async toast(
    mensaje?: string, 
    posicion?: 'top' | 'bottom' | 'middle', 
    duracion?: number, 
    color?: string
  ): Promise<void> {

    const toast = await this.toastController.create({
      message: mensaje,
      position: posicion,
      duration: duracion,
      color: color,
    });
  
    toast.present();
  }

  async alerta(mensaje: string, cabecera?: string) {
    const alert = await this.alertController.create({
      header: cabecera,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
