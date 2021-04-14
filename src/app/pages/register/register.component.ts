import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {}

  toogleMenu(){
    this.menuCtrl.toggle();
  }


}
