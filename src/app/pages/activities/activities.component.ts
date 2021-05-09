import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Add } from 'src/app/models/add';
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

  MyChats: Chat[] = [];
  ChatWithMe: Chat[] = [];
  Persons = [];


  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  ngOnInit() {
    this.fAuth.stateAuth().subscribe(async r => {
      this.uid = r.uid

      this.MyChats = await this.getMyChats(r.uid);
      this.ChatWithMe = await this.getChatWithMe(r.uid);
      this.Persons = await this.getPersons();
    });
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async getMyChats(id: string) {
    const chats: Chat[] = await this.db.getCollectionbyParameter<Chat>('ChatRooms', 'idPerson', id);
    return chats
  }

  async getChatWithMe(id: string) {
    const Chat: Chat[] = await this.db.getCollectionbyParameter<Chat>('ChatRooms', 'idTasker', id);
    return Chat;
  }

  async getPersons() {
    const Persons = [];

    this.MyChats.forEach(async chat => {
      let dataPerson = await this.db.getDoc<Person>('Personas', chat.idTasker);
      let dataAdd = await this.db.getDoc<Add>('Anuncios', chat.idAdd);

      dataPerson = Object.assign({}, dataPerson, chat, dataAdd)
      if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);


    });

    this.ChatWithMe.forEach(async chat => {
      let dataPerson = await this.db.getDoc<Person>('Personas', chat.idPerson);
      let dataAdd = await this.db.getDoc<Add>('Anuncios', chat.idAdd);

      dataPerson = Object.assign({}, dataPerson, chat, dataAdd);

      console.log(dataPerson)
      if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);
    })

    return Persons;
  }

  openChat(id: string) {
    this.router.navigate(['/chat', id])
  }

}
