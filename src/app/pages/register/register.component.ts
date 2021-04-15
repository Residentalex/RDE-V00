import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
import { User } from 'src/app/models/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  loading: any;

  NewPerson: Person = {
    createAt: new Date(),
    status: true
  }

  newUser: User = {
    idPerson: this.NewPerson.idPerson,
    email: "",
    password: "",
    uid: ""
  };

  constructor(
    private menuCtrl: MenuController,
    private loadingCtlr: LoadingController,
    private toastCtrl: ToastController,
    private auth: FirebaseAuthService,
    private db: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() { }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async onRegister() {
    this.presentLoading();
    const res = await this.auth.createUserWithEmailandPassword(this.newUser.email, this.newUser.password).then((data) => {
      this.loading.dismiss();
      this.NewPerson.idPerson = data.user.uid;
      this.createPerson();
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.loading.dismiss();
      console.log(err);
    });
  }

  createPerson() {
    const path = "Personas/";
    this.NewPerson.modifyAt = new Date();
    this.presentLoading();

    this.db.createDoc(this.NewPerson, path, this.NewPerson.idPerson).then((res) => {
      this.loading.dismiss();
    }).catch(err => {
      this.loading.dismiss();
      this.presentToast(err.message);
    })
  }


  async presentLoading() {
    this.loading = await this.loadingCtlr.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true
    });
    await this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

}
