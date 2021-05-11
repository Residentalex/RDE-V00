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

  MyChats = [];
  ChatWithMe = [];
  Persons = [];


  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  async ngOnInit() {
    const user = await this.fAuth.stateAuth()
    this.uid = user.uid;

    this.MyChats = await this.getMyChats(this.uid);
    this.ChatWithMe = await this.getChatWithMe(this.uid);
    this.Persons = await this.getPersons();

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


    let dataPerson = await this.db.getCollection<Person>('Personas');
    let dataAdd = await this.db.getCollection<Add>('Anuncios');

    this.MyChats.forEach(chat => {

    })

    // dataPerson = Object.assign({}, dataPerson, chat, dataAdd);

    // let messageUnRead = 0;

    // chat.data.forEach(element => {
    //   if (element.isRead == false && element.idPerson != this.uid) { messageUnRead += 1 };
    // });

    // Object.defineProperty(dataPerson, 'MessageUnRead', { value: messageUnRead })
    // if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);


    // this.ChatWithMe.forEach(async chat => {
    //   let dataPerson = await this.db.getDoc<Person>('Personas', chat.idPerson);
    //   let dataAdd = await this.db.getDoc<Add>('Anuncios', chat.idAdd);

    //   dataPerson = Object.assign({}, dataPerson, chat, dataAdd);

    //   let messageUnRead = 0;

    //   chat.data.forEach(element => {
    //     if (element.isRead == false && element.idPerson != this.uid) { messageUnRead += 1 };
    //   });

    //   Object.defineProperty(dataPerson, 'MessageUnRead', { value: messageUnRead })
    //   if (Persons.includes(dataPerson) === false) Persons.push(dataPerson);
    // });

    return Persons;
  }

  openChat(id: string) {
    this.router.navigate(['/chat', id])
  }

  async doRefresh(event: any) {
    this.MyChats = await this.getMyChats(this.uid);
    this.ChatWithMe = await this.getChatWithMe(this.uid);
    this.getPersons().then(personData => {
      this.Persons = personData;
      event.target.complete();
    });
  }


}
