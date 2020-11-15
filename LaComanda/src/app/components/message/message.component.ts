import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  messages:string[];
  constructor(private popoverController: PopoverController) {
    this.messages=[]
   }

  ngOnInit() {}

}
