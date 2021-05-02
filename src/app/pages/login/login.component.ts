import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  user: User = {
    email: "",
    password: "",
    idPerson: "",
    uid: ""
  }

  appLogo = "./assets/images/logo.jpg";
  facebookIcon = "./assets/images/facebook.png"
  googleIcon = "./assets/images/google.png"

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private fAuth: FirebaseAuthService,
  ) { }

  ngOnInit() { }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  onLogin() {
    this.fAuth.loginWithEmailandPassword(this.user.email, this.user.password).then(() => {
      this.user = {};
      this.router.navigate(['/home']);
    });
  }

  goPageRegister() {
    this.router.navigate(['/register']);
  }

}
