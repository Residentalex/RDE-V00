import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  newPassword: string = '';
  currentPassword: string = '';
  loading: any;

  constructor(
    private fAuth: FirebaseAuthService,
    private loadingCtlr: LoadingController,
    private router: Router
  ) { }

  ngOnInit() { }

  async presentLoading() {
    this.loading = await this.loadingCtlr.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true,
    });
    await this.loading.present();
  }

  changePassword() {
    this.fAuth.stateAuth().subscribe(user => {
      if (user) {
        this.presentLoading();
        this.fAuth.loginWithEmailandPassword(user.email, this.currentPassword).then(r => {
          user.updatePassword(this.newPassword);
          this.fAuth.logout();
          this.loading.dismiss();
          this.router.navigate(['/login']);
        }).catch(err=>{
          this.loading.dismiss();
        })
      }
    })
  }

}
