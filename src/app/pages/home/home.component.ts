import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) { }

  ngOnInit() {}

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  goPageProfile(){
    this.router.navigate(['/login']); 
  }
}
