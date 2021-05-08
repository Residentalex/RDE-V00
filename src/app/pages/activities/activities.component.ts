import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat';
import { Person } from 'src/app/models/person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {

  uid: string = '';

  Chats:Chat[] = [];
  Persons: Person[] = [];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  ngOnInit() {
    this.fAuth.stateAuth().subscribe(async r => {
      this.uid = r.uid

      this.Chats = await this.getChats(r.uid);
      this.Persons = await this.getPersons();
    });
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async getChats(id: string) {
    const chats = await this.db.getCollectionbyParameter<Chat>('ChatRooms', 'idPerson', id);
    return chats
  }

  async getPersons(){
    const Persons = [];
    this.Chats.forEach( async chat => {
      if (chat.idPerson == this.uid){
        const dataPerson = await this.db.getDoc<Person>('Personas', chat.idTasker);
        if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);
      }else {
        const dataPerson = await this.db.getDoc<Person>('Personas', chat.idPerson);
        if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);
      }
      
    });
    return Persons;
  }

  openChat(id: string){
    this.router.navigate(['/chat', id])
  }

}
