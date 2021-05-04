import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {message} from '../../models/message';
import {FirestoreService} from 'src/app/services/firestore.service';
import {Chat} from '../../models/chat';

import {ActivatedRoute} from '@angular/router';
import {Person} from '../../models/person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';


import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})


export class ChatComponent implements OnInit {


  //mesajes del chat
   chat: any;//esto es para el id
   room: any;// esto me da todas las propiedades del chatRooms
   msg: string;//esta variable es el mensaje
   idChat: string = ' ';//aqui guardo el idchat
   chatRoom: Chat = {};//en este objeto guardo todo lo relaciona con las personas que estan chateando
   person: Person = {};


  constructor(
    private modal: ModalController,
    private db: FirestoreService,
    private route: ActivatedRoute,
    private fAuth: FirebaseAuthService,
    private fcm :FCM
  ) {
  }


  ngOnInit() {

    this.fAuth.stateAuth().subscribe(datos =>{
      if(datos){
        this.db.getDoc<Person>("Personas", datos.uid).subscribe(r =>{
          if(r){
            this.person = r
          }
        })
      }
    })

    this.idChat = this.route.snapshot.params.id;//obtengo el id del chat

    this.db.getDoc('ChatRooms', this.idChat).subscribe(datos => {
      this.chatRoom = datos;

    });//obtengo infomacion relacionas con los usuarios que esta chateando


    this.db.getChatRoom(this.idChat).subscribe(room => {

      if (room) {
        this.room = room;
      }

    });// con esta linear consigo le id del chat que quiero usar

    this.fcm.getToken().then(token => {
    console.log(token)
    });

  }


  sendMessage() {

    const mensaje: message = {
      name: this.person.name,
      content: this.msg,
      type: 'text',
      date: new Date()
    };//esto contiene la infomacion que va a tener el mensaje

    this.db.sendMsgToFirebase(mensaje, this.idChat);
    this.msg = '';

  }//crear el mensaje


}
