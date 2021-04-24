import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, MenuController } from '@ionic/angular';
import { uniq } from "lodash";
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
  servicePath: string = "Servicios";
  personPath: string = 'Personas';

  service$: Service[] = [];
  skill$: any[] = [];
  
  mySkill: any[] = [];
  uid: string = '';

  constructor(
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService,
  ) { }

  ngOnInit() {

    this.fAuth.stateAuth().subscribe(r => {
      this.uid = r.uid;
      this.getServicesPerson('idPerson', this.uid);
    })

    this.getServices();

  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true
    });
    await this.loading.present();
  }

  joinCollections(uid: string) {
    const ServiciosPerona$ = this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idPerson', uid)
      .pipe(
        switchMap(serviciosPersonas => {
          const personaIDs = uniq(serviciosPersonas.map(sp => sp.idPerson));
          return combineLatest(
            of(serviciosPersonas),
            combineLatest(
              personaIDs.map(personaID =>
                this.db.getCollectionbyParameter<Person>(this.personPath, 'idPerson', personaID).pipe(
                  map(personas => personas[0])
                )
              )
            )
          )
        }),
        map(([serviciosPersonas, personas]) => {
          return serviciosPersonas.map(servicioPersona => {
            return {
              ...servicioPersona,
              persona: personas.find((p: any) => p.idPerson === servicioPersona.idPerson)
            }
          })
        })
      );
    ServiciosPerona$.subscribe(r => {
      this.skill$ = r;

    })
  }

  verify(event: any) {
    const checkName = event.target.name;

    if (event.detail.checked) {
      this.mySkill.push(checkName);
    } else {
      this.mySkill = this.mySkill.filter(function (skill) {
        return skill !== checkName
      })
    }
    console.log(this.mySkill);
  }

  VerifyArraycontain(value: any) {
    return this.mySkill.includes(value);
  }

  getServicesPerson(parameter: string, valueParameter: string) {
    this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, parameter, valueParameter).pipe(
      switchMap(servicioPersona => {
        this.skill$ = servicioPersona;
        const servicioID = servicioPersona.map(sp => sp.idService);
        return servicioID;
      })
    ).subscribe(r => {
      if (!this.mySkill.includes(r)) {
        this.mySkill.push(r)
      }
    });
  }

  getServices() {
    this.db.getCollection<Service>(this.servicePath).subscribe(r => {
      this.service$ = r;
    });
  }

  saveSkills() {
    const newSkill: ServicesPerson = {
      idPerson: this.uid,
      idPersonService: '',
      idService: '',
      createdAt: new Date(),
      status: true
    }
    this.skill$.forEach(skill => {
      this.db.deleteDoc(this.servicesPersonPath, skill.idPersonService);
    });

    this.mySkill.forEach(skill => {
      newSkill.idPersonService = this.db.getNewID();
      newSkill.idService = skill

      this.db.createDoc(newSkill, this.servicesPersonPath, newSkill.idPersonService);
    })
  }

}
