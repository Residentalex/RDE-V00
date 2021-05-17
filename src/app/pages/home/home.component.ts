import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { add } from 'lodash';
import { Observable } from 'rxjs';
import { Add } from 'src/app/models/add';
import { Service } from 'src/app/models/service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  userUid: string = '';
  services: Service[] = [];
  servicesPath = "Servicios";
  adds: Observable<Add[]>;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private fAuth: FirebaseAuthService,
    private db: FirestoreService
  ) { }

  async ngOnInit() {
    this.fAuth.subscribeUser().subscribe(user =>{
      user ? this.userUid = user.uid : this.userUid = '';
    });

  

    this.loadServices();
    this.loadAdds();
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  goPageProfile() {
    if (this.userUid) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }

  }

  async loadServices() {
    this.services = await this.db.getCollection<Service>(this.servicesPath, 'serviceName');
  }

  loadAdds() {
    this.adds = this.db.subscribeCollection('Anuncios', 'createdAt');

  }

  publishAdd() {
    this.router.navigate(['/publish-add'])
  }
}
