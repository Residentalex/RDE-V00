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

  servicesPerson: ServicesPerson[];
  servicesID: string;
  serviceName: string;
  servicesPersonPath: string = 'ServicioPersona';
  person: Person[] = []


  constructor(
    private db: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.getServices();
    this.getServicesPerson();
  }

  getServicesPerson() {  
    this.db.getCollectioninArray<ServicesPerson>(this.servicesPersonPath, 'idServices', this.servicesID).pipe(take(1))
    .subscribe(r => {
      this.servicesPerson = r; 
      this.getPerson();
    });
    
  }

  getServices() {
    this.servicesID = this.route.snapshot.params.id;
    this.db.getDoc<Service>('Servicios', this.servicesID).subscribe(r => {
      this.serviceName = r.serviceName
    });
  }

  getPerson() {
    this.servicesPerson.forEach(person => {
      this.db.getDoc<Person>('Personas', person.idPerson).subscribe(r => {

        this.person.push(r)
      })
    });

  }

  goProfileDetails(idPerson: string) {
    this.router.navigate(['/profile', idPerson]);
  }

}
