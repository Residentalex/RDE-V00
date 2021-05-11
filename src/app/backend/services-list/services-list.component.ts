import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, MenuController, ToastController } from '@ionic/angular';
import { Service } from 'src/app/models/service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit {


  path: string = 'Servicios';
  services: Service[] = [];

  constructor(
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private db: FirestoreService,
  ) { }

  async ngOnInit() {
    this.services = await this.getServices();
  }

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  async getServices(){ 
    const services = await this.db.getCollection<Service>(this.path);
    return services;
  }

  async onDeleteService(service: Service){
    const alert = await this.alertCtrl.create({
      cssClass: 'RDE-normal',
      header: 'Advertencia',
      message: 'Desea eliminar el <strong>servicio</strong>?',
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
            this.db.deleteDoc(this.path, service.idService).catch(err =>{
              this.presentToast(err.message);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  onUpdateService(id?: string, itemSliding?: IonItemSliding){
    itemSliding.closeOpened();   
    this.router.navigate(['/set-services', id]);
  }

  goPageSetServices(){
    this.router.navigate(['/set-services']);
  }

  goToServicesPersons(idService: string ){
    this.router.navigate(['/services-person-list', idService]);
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async filterItems(evt: any){
    this.services = await this.getServices();
    const searchTerm: string = evt.target.value;
    
    if(!searchTerm){
      return;
    }

    this.services = this.services.filter(currentService =>{
      if(currentService.serviceName && searchTerm){
        return (currentService.serviceName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
        || currentService.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    })
  }

}
