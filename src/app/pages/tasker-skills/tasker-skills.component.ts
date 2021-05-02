import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { isUndefined, uniq } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Person } from 'src/app/models/person';
import { Service } from 'src/app/models/service';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-tasker-skills',
  templateUrl: './tasker-skills.component.html',
  styleUrls: ['./tasker-skills.component.scss'],
})
export class TaskerSkillsComponent implements OnInit {
  loading: any;
  servicesPersonPath: string = 'ServicioPersona';
  servicePath: string = 'Servicios';
  personPath: string = 'Personas';

  service$: Service[] = [];
  editMode: boolean = false;
  mySkill: any[] = [];
  uid: string = '';
  idPersonServices = '';


  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  ngOnInit() {
    this.getServices();
    this.fAuth.stateAuth().subscribe(r => {

      if(r){

        this.uid = r.uid;
        this.getServicesPerson(r.uid);
      }
    })
  }


  getServicesPerson(id: string) {
    this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idPerson', id).subscribe(r => {
      if (r.length > 0) {
        this.mySkill = r[0].idServices;
        this.idPersonServices = r[0].idPersonService;
        this.editMode = true
      } else {
        this.mySkill = []
      }
    })
  }

  toogleMenu() {
    this.menuCtrl.toggle();
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

  verify(event: any) {

    const checkName = event.target.name;

    if (event.detail.checked) {
      console.log('checked: ', checkName)
      this.mySkill.push(checkName);
    } else {
      console.log("eliminado: ", checkName)
      this.mySkill = this.mySkill.filter(function (skill) {
        return skill !== checkName;
      });
    }
  }

  VerifyArraycontain(value: any) {    
    return this.mySkill.includes(value);
  }

  getServices() {
    this.db.getCollection<Service>(this.servicePath).subscribe(r => {
      this.service$ = r;
    });
  }

  saveSkills() {
    const newSkill: ServicesPerson = {
      idPerson: this.uid,
      idServices: this.mySkill,
      createdAt: new Date(),
      status: true,
    };

    if(this.editMode){
      newSkill.idPersonService = this.idPersonServices;
      this.db.updateDoc(newSkill, this.servicesPersonPath, newSkill.idPersonService);
    }else{
      newSkill.idPersonService = this.db.getNewID();
      this.db.createDoc(newSkill, this.servicesPersonPath, newSkill.idPersonService);
    }

    

    this.router.navigate(['/tasker-tools']);
  }

  
}
