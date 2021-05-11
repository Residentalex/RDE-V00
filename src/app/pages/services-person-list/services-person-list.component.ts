import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

    this.serviceName = (await this.getServices()).serviceName;
    this.servicesPerson = await this.getServicesPerson();
    this.person = await this.getPerson();
  }

  async getServicesPerson() {
    const servicesPerson = await this.db.getCollectioninArray<ServicesPerson>(this.servicesPersonPath, 'idServices', this.servicesID);
    return servicesPerson;
  }

  async getServices() {
    this.servicesID = this.route.snapshot.params.id;
    return this.db.getDoc<Service>('Servicios', this.servicesID);
  }

  async getPerson() {
    const Persons = [];
    this.servicesPerson.forEach(async person => {
      let dataPerson = await this.db.getDoc<Person>('Personas', person.idPerson);
      if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);
    });

    return Persons;

  }

  goProfileDetails(idPerson: string) {
    this.router.navigate(['/profile', idPerson]);
  }

  async filterItems(evt: any) {
    this.person = await this.getPerson();
    console.log(this.person);
    const searchTerm: string = evt.target.value;

    if (!searchTerm) {
      return;
    }

    this.person = this.person.filter(currentPerson => {
      if (currentPerson.name && searchTerm) {
        return (currentPerson.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          || currentPerson.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      }
    })

  }

}
