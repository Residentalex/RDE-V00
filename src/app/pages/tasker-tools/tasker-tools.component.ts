import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { isUndefined } from 'lodash';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-tasker-tools',
  templateUrl: './tasker-tools.component.html',
  styleUrls: ['./tasker-tools.component.scss'],
})
export class TaskerToolsComponent implements OnInit {

  tools: any[] = [];
  tool: string = '';

  newFile: any;

  loading: any;
  servicioPersona: ServicesPerson = {};
  photos: any[] = [];

  uid: string;
  servicesPersonPath: string = "ServicioPersona"

  cameraPhoto = "assets/images/camera.png"

  constructor(
    private fAuth: FirebaseAuthService,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  async ngOnInit() {
    const user = await this.fAuth.stateAuth();
    this.uid = user.uid;
    this.getServicePerson(user.uid);

  }

  async getServicePerson(id: string) {
    const servicesPerson = await this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idPerson', id);

    if (servicesPerson) {
      this.servicioPersona.idPersonService = servicesPerson[0].idPersonService
      this.servicioPersona.skills = servicesPerson[0].skills
      this.tools = servicesPerson[0].tools;
      this.photos = servicesPerson[0].photosWork;
    }
  }

  saveTool() {
    if (isUndefined(this.tools)) {
      this.tools = [this.tool]
    } else {
      this.tools.push(this.tool);
    }
    this.tool = '';

  }

  deleteTool(tool: string) {
    this.tools = this.tools.filter(function (t) {
      return t != tool
    })

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

  onFinish() {
    this.presentLoading();
    this.servicioPersona.tools = this.tools;
    this.servicioPersona.photosWork = this.photos;
    this.db.updateDoc(this.servicioPersona, this.servicesPersonPath, this.servicioPersona.idPersonService).then(() => {
      this.router.navigate(['/profile']);

    }).catch((err) => {
      console.log('error:', err.message)
    }).finally(() => {
      this.loading.dismiss();
    })
  }

  deleteImage(photo: string) {
    this.photos = this.photos.filter(function (item) {
      return item != photo
    })
  }


}

