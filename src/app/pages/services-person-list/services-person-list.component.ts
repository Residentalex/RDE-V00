import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { uniq } from 'lodash';
import { of } from 'rxjs';
import { combineLatest, map, switchMap } from 'rxjs/operators';
import { Person } from 'src/app/models/person';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-services-person-list',
  templateUrl: './services-person-list.component.html',
  styleUrls: ['./services-person-list.component.scss'],
})
export class ServicesPersonListComponent implements OnInit {

  servicesPerson: ServicesPerson[];
  servicesID: string;
  servicesPersonPath: string = 'ServicioPersona';
  person: Person[] = []


  constructor(
    private db: FirestoreService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.servicesID = param['id'];
    });

    this.getServicesPerson();
  }


  getServicesPerson() {
    this.db.getCollectionbyParameter<ServicesPerson>(this.servicesPersonPath, 'idService', this.servicesID).subscribe(r => {
      this.servicesPerson = r
      this.getPerson();
    });
  }


  getPerson() {
    this.servicesPerson.forEach(person => {
      this.db.getCollectionbyParameter<Person>('Personas', 'idPerson', person.idPerson).subscribe(r => {
        this.person.push(r[0])
      })
    });



  }

}
