import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { FirestorageService } from 'src/app/services/firestorage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  path: string = "Usuarios";
  profileImage: string = '';
  newFile: string = '';
  loading: any;

  constructor(
    private menuCtrl: MenuController,
    private loadingCtlr: LoadingController,
    private fireST: FirestorageService
  ) { }



  ngOnInit() {}

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  uploadImage(event: any){
    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.profileImage = image.target.result as string;
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async onSave(){
    this.presentLoading();
    const photo = await this.fireST.uploadImage(this.newFile, this.path, 'prueba').then( res=>{
      this.loading.dismiss();
    });
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

}
