import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Add } from 'src/app/models/add';
import { Person } from 'src/app/models/person';
import { Service } from 'src/app/models/service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {

  @Input() adds: Add

  person: Person = {};

  constructor(
    private db: FirestoreService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.person = await this.getPerson();
    this.person.name = this.person.name.split(' ')[0]
    this.person.lastName = this.person.lastName.split(' ')[0]
  }

  async getPerson(){
    const person = await this.db.getDoc('Personas', this.adds.idPerson);
    return person;
  }
  
  goPageAdd(){
    this.router.navigate(['/add', this.adds.idAdd]);
  }
}
