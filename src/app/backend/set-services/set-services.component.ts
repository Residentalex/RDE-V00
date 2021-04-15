import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Service } from 'src/app/models/service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-services',
  templateUrl: './set-services.component.html',
  styleUrls: ['./set-services.component.scss'],
})
export class SetServicesComponent implements OnInit {


  path = 'Servicios/';
  service: Service;
  newService: Service = {
    idService: this.db.getNewID(),
    serviceName: '',
    description: '',
    createAt: new Date(),
    status: true
  }
  loading: any;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtlr: LoadingController,
    private toastCtrl: ToastController,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDoc(id);
    }
  }

  getDoc(id: string) {
    this.db.getDoc<Service>(this.path, id).subscribe(res => {
      this.newService = res
    })
  }

  toogleMenu() {
    this.menuCtrl.toggle('RDE-menu');
  }

  onSave() {
    this.newService.modifyAt = new Date();
    this.presentLoading();

    this.db.createDoc(this.newService, this.path, this.newService.idService).then((res) => {
      this.loading.dismiss();
      this.router.navigate(['/services-list']);

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
