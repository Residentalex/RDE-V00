import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private auth: FirebaseAuthService,
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  goPageProfile(){
    this.router.navigate(['/login']); 
  }
}
