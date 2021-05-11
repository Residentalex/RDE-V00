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

  servicesList: Service[] = [];
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

  async ngOnInit() {
    this.servicesList = await this.getServices();
    const user = await this.fAuth.stateAuth();

    this.uid = user.uid;
    this.getServicesPerson(user.uid);
  }


  async getServicesPerson(id: string) {
    const servicesPerson = await this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idPerson', id);

    if (servicesPerson.length > 0) {
      this.mySkill = servicesPerson[0].idServices;
      this.idPersonServices = servicesPerson[0].idPersonService;
      this.editMode = true
    } else {
      this.mySkill = []
    }
    return servicesPerson;

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
      this.mySkill.push(checkName);
    } else {
      this.mySkill = this.mySkill.filter(function (skill) {
        return skill !== checkName;
      });
    }
  }

  VerifyArraycontain(value: any) {
    return this.mySkill.includes(value);
  }

  async getServices() {
    const services = await this.db.getCollection<Service>(this.servicePath);
    return services;
  }

  saveSkills() {
    const newSkill: ServicesPerson = {
      idPerson: this.uid,
      idServices: this.mySkill,
      createdAt: new Date(),
      status: true,
    };

    if (this.editMode) {
      newSkill.idPersonService = this.idPersonServices;
      this.db.updateDoc(newSkill, this.servicesPersonPath, newSkill.idPersonService);
    } else {
      newSkill.idPersonService = this.db.getNewID();
      this.db.createDoc(newSkill, this.servicesPersonPath, newSkill.idPersonService);
    }



    this.router.navigate(['/tasker-tools']);
  }

  async filterItems(evt: any) {
    this.servicesList = await this.getServices();
    const searchTerm: string = evt.target.value;

    if (!searchTerm) {
      return;
    }

    this.servicesList = this.servicesList.filter(currentService => {
      if (currentService.serviceName && searchTerm) {
        return (currentService.serviceName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentService.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    })
  }

}
