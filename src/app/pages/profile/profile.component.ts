import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
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

  profileImage: string = '';
  newFile: string = '';
  loading: any;

  constructor(
    private menuCtrl: MenuController,
    private loadingCtlr: LoadingController,
    private fireST: FirestorageService,
    private db: FirestoreService
  ) {}

  ngOnInit() {}

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        this.profileImage = image.target.result as string;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async onSave() {
    this.presentLoading();

    await this.fireST
      .uploadImage(this.newFile, this.path, this.newPerson.idPerson)
      .then((res) => {
        this.newPerson.photo = res;

        this.loading.dismiss();
      });

    this.db.createDoc(this.newPerson, this.path, this.newPerson.idPerson);
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
  
}
