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


  async ngOnInit() {

    const user = await this.fAuth.stateAuth();
    this.uid = user.uid

    const idPerson = this.route.snapshot.params.id;
    this.getPerson(idPerson);
  }


  async getPerson(id: string) {
    this.db.getDoc<Person>('Personas', id).then(async r => {
      if (r) {
        this.person = r
        this.taskerName = r.name + ' ' + r.lastName;
        const tasker = await this.db.getCollectionbyParameter('ServicioPersona', 'idPerson', r.idPerson);
        this.tasker = tasker[0]
      }
    });
  }

  goProfile(){
    this.router.navigate(['/profile']);
  }

  async contact() {
    const chatRoomsTasker = await this.db.getCollectionby2Parameter("ChatRooms", "idtasker", this.tasker.idPerson, "idperson", this.uid);
    const chatRoomsPerson = await this.db.getCollectionby2Parameter("ChatRooms", "idTasker", this.uid, "idPerson", this.tasker.idPerson);
    
  }

  
}
