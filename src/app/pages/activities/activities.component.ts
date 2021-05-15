import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
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

  myChat$ = [];
  chatWithMe = [];
  Persons: Person[] = [];
  Adds: Add[] = [];
  loading: any;


  constructor(
    private menuCtrl: MenuController,
    private loadingCtlr: LoadingController,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  async ngOnInit() {
    const user = await this.fAuth.stateAuth()
    this.uid = user.uid;

    this.Persons = await this.getPersons();
    this.Adds = await this.getAdds();

    this.getMyChats();


  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  async getPersons() {
    const Persons = await this.db.getCollection<Person>('Personas');
    return Persons
  }

  async getAdds() {
    const Adds = await this.db.getCollection<Add>('Anuncios');
    return Adds
  }

  getMyChats() {

    this.db.subscribeCollectionbyParameter<Chat>('ChatRooms', 'idPerson', this.uid).subscribe(chats => {
      console.log('Ejecutando myChats')
      const PersonIContact = [];
      this.myChat$ = [];
      chats.forEach(chat => {
        let dataPerson: Person = this.Persons.filter(data => data.idPerson === chat.idTasker)[0];
        let dataAdd: Add = this.Adds.filter(data => data.idAdd === chat.idAdd)[0]

        dataPerson = Object.assign({}, dataPerson, chat, dataAdd);
        let messageUnRead = 0;

        if (chat.data) {
          chat.data.forEach(element => {
            if (element.isRead == false && element.idPerson != this.uid) { messageUnRead += 1 };
          });

          Object.defineProperty(dataPerson, 'MessageUnRead', { value: messageUnRead });
        }

        if (PersonIContact.includes(dataPerson) === false) {
          PersonIContact.push(dataPerson);
        }
      })


      this.myChat$ = PersonIContact
    })

    this.db.subscribeCollectionbyParameter<Chat>('ChatRooms', 'idTasker', this.uid).subscribe(chats => {
      console.log('Ejecutando ChatWithMe')
      const PersoncontactMe = []
      this.chatWithMe = [];
      chats.forEach(chat => {
        let dataPerson: Person = this.Persons.filter(data => data.idPerson === chat.idPerson)[0];
        let dataAdd: Add = this.Adds.filter(data => data.idAdd === chat.idAdd)[0]

        dataPerson = Object.assign({}, dataPerson, chat, dataAdd);
        let messageUnRead = 0;

        if (chat.data) {
          chat.data.forEach(element => {
            if (element.isRead == false && element.idPerson != this.uid) { messageUnRead += 1 };
          });

          Object.defineProperty(dataPerson, 'MessageUnRead', { value: messageUnRead });

          if (PersoncontactMe.includes(dataPerson) === false) {
            PersoncontactMe.push(dataPerson);
          }
        }


      })


      this.chatWithMe = PersoncontactMe
    })

  }

  openChat(id: string) {
    this.router.navigate(['/chat', id])
  }

  async doRefresh(event: any) {

    event.target.complete();
  }

  onDeleteChat(id: string) {
    this.presentLoading();
    this.db.deleteDoc('ChatRooms', id);
    this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtlr.create({
      message: 'Cargando..',
      cssClass: 'RDE-normal',
      spinner: 'crescent',
      showBackdrop: true,
    });
    await this.loading.present();
  }


}
