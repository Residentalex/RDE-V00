import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-tasker-tools',
  templateUrl: './tasker-tools.component.html',
  styleUrls: ['./tasker-tools.component.scss'],
})
export class TaskerToolsComponent implements OnInit {

  tools = [];
  tool: string;

  newFile: any;

  loading: any;
  servicioPersona: ServicesPerson = {
    skills: ''
  };
  photos = [];

  uid: string;
  servicesPersonPath: string = "ServicioPersona"

  cameraPhoto = "assets/images/camera.png"

  constructor(
    private fAuth: FirebaseAuthService,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.fAuth.stateAuth().subscribe(r => {
      if (r) {

        this.uid = r.uid;
        this.getServicePerson(r.uid);
      }
    });

  }


  getServicePerson(id: string) {
    this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idPerson', id).subscribe(r => {
      if (r) {
        this.servicioPersona.idPersonService = r[0].idPersonService
        this.servicioPersona.skills = r[0].skills
        this.tools = r[0].tools;
        this.photos = r[0].photosWork;
      }
    })
  }

  saveTool() {
    this.tools.push(this.tool);
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

  uploadImage(event: any){
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (image) => {
        
        this.photos.push(image.target.result as string)
        
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

  deleteImage(photo: string){
    this.photos = this.photos.filter(function(item){
      return item != photo
    })
  }

}
