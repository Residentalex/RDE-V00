import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { add } from 'lodash';
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
  adds: Add[] = []

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private fAuth: FirebaseAuthService,
    private db: FirestoreService
  ) { }

  async ngOnInit() {
    const user = await this.fAuth.stateAuth();

    user ?  this.userUid = user.uid : this.userUid = '';

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
    this.services = await this.db.getCollection<Service>(this.servicesPath);
  }

  loadAdds() {
    this.db.subscribeCollection('Anuncios').subscribe((r) => {
      this.adds = r
    });
  }

  publishAdd() {
    this.router.navigate(['/publish-add'])
  }
}
