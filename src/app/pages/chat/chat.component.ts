import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {message} from '../../models/message';
import {FirestoreService} from 'src/app/services/firestore.service';
//import {Chat} from '../../models/chat';

import {ActivatedRoute} from '@angular/router';
import {Chat} from '../../models/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})



export class ChatComponent implements OnInit {


  //mesajes del chat
  public chat: any;
  public messages = [];
  public room: any;
  public msg: string;
  private uid: string = this.route.snapshot.params.id;




  constructor(
    private modal: ModalController,
    private db: FirestoreService,
    private route: ActivatedRoute,
  ) {}

  newChat: Chat = {};

  name:string = this.newChat.chatName;


  ngOnInit() {

    this.db.getChatRoom( this.uid).subscribe( room => {
      console.log(room);
      this.room = room;
    })// con esta linear consigo le id del chat que quiero usar


  }

  sendMessage() {

    const mensaje: message = {
      //name: this.name,
      content: this.msg,
      type: 'text',
      date: new Date()
    };//esto contiene la infomacion que va a tener el mensaje

    this.db.sendMsgToFirebase(mensaje, this.uid);
    this.msg = '';

  }


}
