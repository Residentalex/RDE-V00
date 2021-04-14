import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) { }

  ngOnInit() {}

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  onLogin(){}

  goPageRegister(){
    this.router.navigate(['/register']);
  }

}
