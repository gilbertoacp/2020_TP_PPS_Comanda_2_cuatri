import { Injectable } from '@angular/core';
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@Injectable({
  providedIn: 'root'
})
export class ConfirmarRegistroService {

  constructor(private ec: EmailComposer) 
  {
    //
  }

  sendMail(to, subject, body){
    let mail = {
      to: to,
      subject: subject,
      body: body,
      isHtml: true
    };
    this.ec.open(mail);
  }
}
