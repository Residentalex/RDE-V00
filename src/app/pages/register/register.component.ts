import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
import { Phone } from 'src/app/models/phone';
import { User } from 'src/app/models/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  appLogo = "./assets/images/logo.jpg";

  loading: any;
  personPath = "Personas/";
  phonePath = "Telefonos/";

  NewPerson: Person = {
    createdAt: new Date(),
    status: true
  }

  newUser: User = {
    idPerson: this.NewPerson.idPerson,
    email: "",
    password: "",
    uid: ""
  };

  newPhone: Phone ={
    idPhone: '',
    phoneNumber: '',
    createdAt: new Date(),
    status: true
  }

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
      this.newPhone.idPhone = data.user.uid;
      this.createPerson();
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.loading.dismiss();
      console.log(err);
    });
  }

  createPerson() {

    this.NewPerson.modifyAt = new Date();
    this.presentLoading();

    this.db.createDoc(this.NewPerson, this.personPath, this.NewPerson.idPerson).then((res) => {

      this.db.createDoc(this.newPhone, this.phonePath, this.newPhone.idPhone);
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
