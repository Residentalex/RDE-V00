import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
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
    private loading : LoadingController
  ) { }

  ngOnInit() { }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async onLogin() {
     
    if (this.fAuth.formValidationLogin(this.user.email,this.user.password))
    //Create Loading
    {
      let loader =this.loading.create({
        message:'Cargando',
        duration:2000
      });
      (await loader).present();
                //Login usuario
        try {   this.fAuth.loginWithEmailandPassword(this.user.email, this.user.password).then(res => {
            
          this.user = {};
          this.router.navigate(['/home'])
          //Si el usuario no existe o esta mal escrito
        }).catch(err=>this.fAuth.showToast(err));
      }catch(e){
        this.fAuth.showToast(e);

      }
    
    }
   




  }

  goPageRegister() {
    this.router.navigate(['/register']);
  }

}
