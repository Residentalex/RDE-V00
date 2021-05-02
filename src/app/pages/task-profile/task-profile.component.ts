import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from 'src/app/models/chat';
import { Person } from 'src/app/models/person';
import { ServicesPerson } from 'src/app/models/services-person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
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
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  taskerName: string;
  person: Person = {};
  tasker: ServicesPerson = {};

  newChat: Chat = {}
  uid: string = '';


  ngOnInit() {

    this.fAuth.stateAuth().subscribe(r => {
      if (r) {
        this.uid = r.uid;
      }

    })

    const idPerson = this.route.snapshot.params.id;
    this.getPerson(idPerson);
  }


  getPerson(id: string) {
    this.db.getDoc<Person>('Personas', id).subscribe(r => {
      if (r) {
        this.person = r
        this.taskerName = r.name + ' ' + r.lastName;
        this.db.getCollectionbyParameter('ServicioPersona', 'idPerson', r.idPerson).subscribe(r => {
          this.tasker = r[0]
        })
      }
    });
  }

  contact() {
    console.log(this.tasker.idPerson)
    console.log(this.uid)
    this.db.getCollectionby2Parameter("ChatRooms", "idtasker", this.tasker.idPerson, "idperson", this.uid).subscribe(datos => {
      if(datos){
        console.log("de Person a Tasker: ", datos)
      }else{
        this.db.getCollectionby2Parameter("ChatRooms", "idTasker", this.uid, "idPerson", this.tasker.idPerson).subscribe(datos =>{
          console.log("de Tasker a Person: ", datos)
        })
      }
    })
  }

}
