import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { PopoverController, ToastController } from '@ionic/angular';
import {MessageComponent} from '../message/message.component';
@Component({
  selector: 'app-qr-lector',
  templateUrl: './qr-lector.component.html',
  styleUrls: ['./qr-lector.component.scss'],
})
export class QrLectorComponent implements OnInit {
  @Input() title:string;
  @Output() info_escaneada: EventEmitter<any> = new EventEmitter<any>();

  opciones: BarcodeScannerOptions = {
    preferFrontCamera: false, // iOS and Android
    showFlipCameraButton: false, // iOS and Android
    showTorchButton: true, // iOS and Android
    torchOn: false, // Android, launch with the torch switched on (if available)
    prompt: "Escanear el DNI", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    formats: "PDF_417,QR_CODE", // default: all but PDF_417 and RSS_EXPANDED --QR_CODE
    orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
    disableAnimations: true, // iOS
    disableSuccessBeep: false // iOS and Android
  }

  constructor(private barcodeScanner: BarcodeScanner, private router: Router, public toastController: ToastController,private popoverController: PopoverController) {
  }
  info_recibida:string;

  ngOnInit() {
    // setTimeout(() => {
    //   this.presentPopover();
    // }, 4000);
   }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  async presentPopover() {
    const popover = await this.popoverController.create({
      component: MessageComponent,
      cssClass: 'popover',
      translucent: true
    });
    return await popover.present();
  }


  

  escanear_imagen() {
    this.barcodeScanner.scan(this.opciones).then(result => {
      // alert("We got a barcode\n" +
      //   "Result: " + result.text + "\n" +
      //   "Format: " + result.format + "\n" +
      //   "Cancelled: " + result.cancelled);
      this.info_recibida = result.text;
      this.info_escaneada.emit(this.info_recibida);

    }).catch(err => {
      alert("Scanning failed: " + err);
    });


  }
}
