import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {

  message: string = "";

  constructor(
    private db: FirestoreService
  ) { }

  ngOnInit() {}

  async sendMessage( ){
    const message = document.getElementById("message").innerText


  }

}
