import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { uniq } from 'lodash';
import { of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { Person } from 'src/app/models/person';
import { Service } from 'src/app/models/service';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-services-person-list',
  templateUrl: './services-person-list.component.html',
  styleUrls: ['./services-person-list.component.scss'],
})
export class ServicesPersonListComponent implements OnInit {

  servicesPerson: ServicesPerson[] = [];
  servicesID: string;
  serviceName: string;
  servicesPersonPath: string = 'ServicioPersona';
  person: Person[] = []


  constructor(
    private db: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {

    this.getServices();
    this.servicesPerson = await this.getServicesPerson();
    this.getPerson();
  }

  async getServicesPerson() {
    const servicesPerson = await this.db.getCollectioninArray<ServicesPerson>(this.servicesPersonPath, 'idServices', this.servicesID);
    return servicesPerson;
  }

  async getServices() {
    this.servicesID = this.route.snapshot.params.id;
    this.serviceName = (await this.db.getDoc<Service>('Servicios', this.servicesID)).serviceName;
  }

  getPerson() {
    this.servicesPerson.forEach(async person => {
      let dataPerson = await this.db.getDoc<Person>('Personas', person.idPerson);
      this.person.push(dataPerson);
    });

  }

  goProfileDetails(idPerson: string) {
    this.router.navigate(['/profile', idPerson]);
  }

  async filterItems(evt: any) {

  }

}
