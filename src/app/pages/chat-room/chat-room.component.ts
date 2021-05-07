import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
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
    type: "Text"
  }
  idChat: string;

  constructor(
    private db: FirestoreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idChat = this.route.snapshot.params.id;
  }

  async sendMessage() {
    const messageText = document.getElementById("message").innerText;

    this.message.content = messageText;
    this.db.sendCollectionToCollection(this.message, 'ChatRooms', this.idChat)
  }

}
