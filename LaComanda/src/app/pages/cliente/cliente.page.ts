import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  constructor(
    private authService : AuthService
  ) { }

  ngOnInit() {
  }

  
  salir(){
    this.authService.logout();
  }

}
