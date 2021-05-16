import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { Person } from 'src/app/models/person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {

  message: Message = {
    content: "",
    date: new Date(),
    type: "text",
    idPerson: "",
    isRead: false
  }

  message$: any[] = [];
  uid: string = "";
  chat: any = {};
  person: Person = {};
  tasker: Person = {};

  constructor(
    private db: FirestoreService,
    private fAuth: FirebaseAuthService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    const user = await this.fAuth.stateAuth();
    this.uid = user.uid;


    this.chat.idChat = this.route.snapshot.params.id;

    this.db.subscribeDoc<Chat>('ChatRooms', this.chat.idChat).subscribe(async r => {
      if (r) {

        this.chat = r
        this.message$ = this.chat.data;
        this.person = await this.getPerson(r.idPerson);
        this.tasker = await this.getPerson(r.idTasker);

      }
    });
  }

  ionViewDidEnter() {
    if (this.chat) {
      this.readMessages(this.chat.data)
    }
  }

  readMessages(message: Message[]) {
    let messageUpdate: Message[] = [];

    if (message) {

      message.forEach(element => {
        if (element.isRead == false && element.idPerson != this.uid) {
          element.isRead = true;
        }
        if (messageUpdate.includes(element) === false) messageUpdate.push(element);
      });

      this.message$ = messageUpdate;
      this.chat.data = this.message$;
      this.db.updateDoc(this.chat, 'ChatRooms', this.chat.idChat);
    }
  }

  async getPerson(id: string) {
    const person = await this.db.getDoc('Personas', id);
    return person;
  }

  async sendMessage() {
    const messageText = document.getElementById("message").innerText;
    this.message.content = messageText;
    this.message.idPerson = this.uid;

    this.db.sendCollectionToCollection(this.message, "ChatRooms", this.chat.idChat)
    document.getElementById("message").innerHTML = '';
  }

  MakeADeal(){
    console.log('Haciendo Trato')
  }


}
