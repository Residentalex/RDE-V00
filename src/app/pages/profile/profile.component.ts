import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { Person } from 'src/app/models/person';
import { Phone } from 'src/app/models/phone';
import { ServicesPerson } from 'src/app/models/services-person';
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

  istasker: boolean = false;
  editMode: boolean = false;
  personPath: string = 'Personas/';
  phonePath: string = 'Telefonos/';
  servicePersonPath: string = 'ServicioPersona/';
  person: Person;

  servicesPerson: ServicesPerson[] = [];

  user: User = {
    email: ""
  };

  newPerson: Person = {
    idPerson: this.db.getNewID(),
    name: '',
    lastName: '',
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

  newFile: string = 'assets/images/profile.png';
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
        this.getPersonInfo(res.uid);
        this.getPersonService(res.uid);
      }
    }); 
  }

  getPersonInfo(idPerson: string) {
    this.db.getDoc<Person>(this.personPath, idPerson).subscribe(res => {
     
      this.newPerson = res;
    });
    this.db.getDoc<Phone>(this.phonePath, idPerson).subscribe(res => {
      this.newPhone = res;
    })
  }

  getPersonService(idPerson: string){
    this.db.getCollectionbyParameter(this.servicePersonPath, 'idPerson', idPerson).subscribe( r=> {
      this.servicesPerson = r;
      r.length > 0 ? this.istasker = true : this.istasker = false;
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
      this.loading.dismiss();
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

  deleteImage(){

    this.newPerson.photo = '';
    this.newFile = undefined
  }

  goPageChangePassword(){
    this.router.navigate(['/change-password'])
  }

}
