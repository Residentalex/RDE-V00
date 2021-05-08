import { Component, OnInit } from '@angular/core';
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

  chats: Observable<Chat[]>

  constructor(
    private menuCtrl: MenuController,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) { }

  ngOnInit() {
    this.fAuth.stateAuth().subscribe(r => {
      this.uid = r.uid

      this.getChats(r.uid);
    });
  }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

  getChats(id: string) {
    this.chats = this.db.subscribeCollectionbyParameter('ChatRooms', 'idPerson', id);
  }

  async getPerson(id: string) {
    const person: Person = await this.db.getDoc('Personas', id);
    return person
  }

}
