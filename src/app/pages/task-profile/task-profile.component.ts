import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-task-profile',
  templateUrl: './task-profile.component.html',
  styleUrls: ['./task-profile.component.scss'],
})
export class TaskProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: FirestoreService
  ) { }

  taskerName: string;
  person: Person;

  ngOnInit() {
    const idPerson = this.route.snapshot.params.id;
    this.getPerson(idPerson);
  }


  getPerson(id: string){
    this.db.getDoc<Person>('Personas', id).subscribe(r =>{
      this.person = r;
      console.log(this.person.photo);
      
      this.taskerName = r.name + ' ' + r.lastName;
    })
  }

}
