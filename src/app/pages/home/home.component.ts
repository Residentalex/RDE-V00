import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  userUid: string = '';

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private fAuth: FirebaseAuthService
  ) { 
    this.fAuth.stateAuth().subscribe(res =>{
      res ? this.userUid = res.uid : this.userUid = "";
    })
  }

  ngOnInit() {}

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
}
