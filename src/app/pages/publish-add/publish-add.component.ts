import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { isUndefined } from 'lodash';
import { Add } from 'src/app/models/add';
import { Service } from 'src/app/models/service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-publish-add',
  templateUrl: './publish-add.component.html',
  styleUrls: ['./publish-add.component.scss'],
})
export class PublishAddComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  loading: any;
  services: Service[] = []
  photosCount: number;
  add: Add = {};
  uid: string = '';
  photos: any[] = [];
  newFile: any;



  async ngOnInit() {
    this.services = await this.getServices();

    this.fAuth.stateAuth().subscribe(r =>{
      this.uid = r.uid
    })
  }

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  async getServices(){
    const services =  await this.db.getCollection<Service>('Servicios');
    return services
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true,
    });
    await this.loading.present();
  }

  onPublish(){

    this.presentLoading();
    this.add.idAdd = this.db.getNewID();
    this.add.idPerson = this.uid
    this.add.createdAt = new Date();
    this.add.status = true
    this.add.addPhotos = this.photos;

    this.db.createDoc(this.add, 'Anuncios',  this.add.idAdd).then(()=>{
      this.loading.dismiss();
      this.router.navigate(['home']);
    }).catch((err)=>{
      console.log(err.message);
      this.loading.dismiss();
    });
  }

  uploadImage(event: any){
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        
        if(isUndefined(this.photos)){
          this.photos = [image.target.result as string]
        }else{
          this.photos.push(image.target.result as string)
        }
        
        
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
