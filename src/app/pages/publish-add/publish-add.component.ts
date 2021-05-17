import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
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
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService,
    private geolocation: Geolocation
  ) { }

  add: Add = {};

  addPath: string = "Anuncios";
  loading: any;
  services: Service[] = []
  photosCount: number;
  uid: string = '';
  photos: any[] = [];
  newFile: any;
  position: Geoposition


  async ngOnInit() {
    this.services = await this.getServices();

    const user = await this.fAuth.stateAuth();
    user ? this.uid = user.uid : this.uid = "";

    const id = this.route.snapshot.params.id;
    if (id) {
      this.add = await this.getAdd(id);

      if(this.add) {document.getElementById('description').innerHTML = this.add.details;}
    }

    this.position = await this.getGeolocation();
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async getServices() {
    const services = await this.db.getCollection<Service>('Servicios');
    return services
  }

  async getAdd(id: string) {
    const add = await this.db.getDoc('Anuncios', id);
    return add
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

  onPublish() {

    this.presentLoading();
    this.add.idAdd = this.db.getNewID();
    this.add.details = document.getElementById("description").innerText;
    this.add.idPerson = this.uid
    this.add.createdAt = new Date();
    this.add.status = true
    this.add.addPhotos = this.photos;
    this.add.location = {
      latitude: this.position.coords.latitude,
      longitude: this.position.coords.longitude
    }

    this.db.createDoc(this.add, 'Anuncios', this.add.idAdd).then(() => {
      this.loading.dismiss();
      this.router.navigate(['home']);
    }).catch((err) => {
      console.log(err.message);
      this.loading.dismiss();
    });
  }

  onEdit(id: string) {
    this.presentLoading();
    this.add.details = document.getElementById("description").innerText;
    this.add.addPhotos = this.photos;
    this.add.modifyAt = new Date();
    this.db.updateDoc(this.add, this.addPath, id).then(() => {
      this.loading.dismiss();
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.log(err.message);
      this.loading.dismiss();
    })
  }

  async onDelete(id: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'RDE-normal',
      header: 'Advertencia',
      message: 'Desea eliminar el <strong>Anuncio</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'RDE-normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.db.deleteDoc(this.addPath, id).then(() => {
              this.router.navigate(['/home']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {

        if (isUndefined(this.photos)) {
          this.photos = [image.target.result as string]
        } else {
          this.photos.push(image.target.result as string)
        }


      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async getGeolocation() {
    const position = await this.geolocation.getCurrentPosition();
    return position;
  }


}
