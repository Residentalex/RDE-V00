import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private fAuth: FirebaseAuthService,
    private db: FirestoreService
  ) { 
    this.fAuth.stateAuth().subscribe(res =>{
      res ? this.userUid = res.uid : this.userUid = "";
    });
  }

  ngOnInit() {
    this.loadServices();
  }

  toogleMenu(){
    this.menuCtrl.toggle();
  }

  goPageProfile(){    
    if(this.userUid){
      this.router.navigate(['/profile']);
    }else {
      this.router.navigate(['/login']); 
    }
    
  }

  loadServices(){
    this.db.getCollection<Service>(this.servicesPath).subscribe(res =>{
      this.services = res
    })
  }
}
