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
    idPerson: ""
  }
  uid: string = "";
  chat: any = {};
  person: Person = {};
  tasker: Person = {};

  constructor(
    private db: FirestoreService,
    private fAuth: FirebaseAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fAuth.stateAuth().subscribe(r =>{
      this.uid = r.uid;
    });

    this.chat.idChat = this.route.snapshot.params.id;

    this.db.subscribeDoc<Chat>('ChatRooms', this.chat.idChat).subscribe(async r =>{
      this.chat = r
      this.person = await this.getPerson(r.idPerson);
      this.tasker = await this.getPerson(r.idTasker);
    })
  }

  async getPerson(id: string){
    const person = await this.db.getDoc('Personas', id);
    return person;
  }

  async sendMessage( ){
    const messageText = document.getElementById("message").innerText;
    this.message.content = messageText;
    this.message.idPerson = this.uid;
    
    this.db.sendCollectionToCollection(this.message, "ChatRooms", this.chat.idChat )
    document.getElementById("message").innerHTML = '';
  }

}
