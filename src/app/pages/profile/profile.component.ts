import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
import { Phone } from 'src/app/models/phone';
import { User } from 'src/app/models/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  editMode: boolean = false;
  personPath: string = 'Personas/';
  phonePath: string = 'Telefonos/';
  person: Person;

  user: User = {
    email: ""
  };

  newPerson: Person = {
    idPerson: this.db.getNewID(),
    name: '',
    dateBirth: new Date(),
    createdAt: new Date(),
    status: true,
  };

  newPhone: Phone = {
    idPhone: '',
    phoneNumber: '',
    createdAt: new Date(),
    status: true,
  }

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

  }

  ngOnInit() {   
    this.fAuth.stateAuth().subscribe(res => {
      if (res) {
        this.user.email = res.email;

        this.newPerson.idPerson = res.uid;
        this.getPersonInfo(this.newPerson.idPerson);
      }
    }); 
  }

  getPersonInfo(idPerson: string) {
    this.db.getDoc<Person>(this.personPath, idPerson).subscribe(res => {
      console.log('nombre: ', res.name, ' ', res.lastName);
      
      
      this.newPerson = res;
    });
    this.db.getDoc<Phone>(this.phonePath, idPerson).subscribe(res => {
      this.newPhone = res;
    })
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
      await this.fireST.uploadImage(this.newFile, this.personPath, this.newPerson.idPerson).then((res) => {
        this.newPerson.photo = res;
      })
    };

    this.db.createDoc(this.newPerson, this.personPath, this.newPerson.idPerson).then(() => {
      this.db.updateDoc(this.newPhone, this.phonePath, this.newPhone.idPhone);
      this.loading.dismiss();
      this.editMode = false;
    }).catch((err) => {
      console.log(err);

    });
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

  signOut() {
    this.newPerson = {};
    this.newPhone = {}
    this.fAuth.logout().then(() => {
      this.router.navigate(['/home']);
    })
  }

  onEditMode() {
    this.editMode ? this.editMode = false : this.editMode = true;
  }

  becomeTasker(){
    this.router.navigate(['/tasker-skill'])
  }

}
