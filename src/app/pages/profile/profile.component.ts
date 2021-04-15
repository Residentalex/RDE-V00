import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  path: string = 'Personas/';
  person: Person;
  newPerson: Person = {
    idPerson: this.db.getNewID(),
    name: '',
    createAt: new Date(),
    status: true,
  };

  newFile: string = '';
  loading: any;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtlr: LoadingController,
    private fireST: FirestorageService,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) {
    this.fAuth.stateAuth().subscribe(res =>{
      this.newPerson.idPerson = res.uid;
      this.getPersonInfo(this.newPerson.idPerson);
    });
   }

  ngOnInit() {
  }

  getPersonInfo(idPerson: string){
    this.db.getDoc<Person>(this.path, idPerson).subscribe( res =>{
      this.newPerson = res;
    });
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.newPerson.photo = image.target.result as string;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async onSave() {
    this.presentLoading();

    if (this.newFile !== undefined) {
      await this.fireST.uploadImage(this.newFile, this.path, this.newPerson.idPerson).then((res) => {
        this.newPerson.photo = res;
      })
    };

    this.db.createDoc(this.newPerson, this.path, this.newPerson.idPerson).then(() => {
      this.loading.dismiss();
    }).catch((err) => { });
  }

  async presentLoading() {
    this.loading = await this.loadingCtlr.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true,
    });
    await this.loading.present();
  }

  signOut(){
    this.fAuth.logout().then(() =>{
      this.router.navigate(['/home']);
    })
  }

}
