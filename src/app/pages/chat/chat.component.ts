import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {message} from '../../models/message';
import {FirestoreService} from 'src/app/services/firestore.service';
import {Chat} from '../../models/chat';

import {ActivatedRoute} from '@angular/router';
import {Person} from '../../models/person';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})


export class ChatComponent implements OnInit {


  //mesajes del chat
  public chat: any;//esto es para el id
  public messages = [];//Arreglo que contiene el contenido del chat
  public room: any;// esta me da el chatRooms
  public msg: string;//esta variable es el mensaje
  private idChat: string = '';//aqui guardo el idchat
  private chatRoom: Chat = {};//en este objeto guardo todo lo relaciona con las personas que estan chateando




  constructor(
    private modal: ModalController,
    private db: FirestoreService,
    private route: ActivatedRoute,

  ) {
  }


  ngOnInit() {

    this.idChat = this.route.snapshot.params.id;//obtengo el id del chat

    this.db.getDoc('ChatRooms', this.idChat).subscribe(datos => {
      this.chatRoom = datos;

      this.db.getDoc<Person>('Personas', this.chatRoom.idperson).subscribe(datosP => {


      });//obtengo el nombre de la persona que esta logueda


    });//obtengo infomacion relacionas con los usuarios que esta chateando

    this.db.getChatRoom(this.idChat).subscribe(room => {
      this.room = room;
    });// con esta linear consigo le id del chat que quiero usar


  }

  sendMessage() {

    const mensaje: message = {
      //name: this.name,
      content: this.msg,
      type: 'text',
      date: new Date()
    };//esto contiene la infomacion que va a tener el mensaje

    this.db.sendMsgToFirebase(mensaje, this.idChat);
    this.msg = '';

  }


}
