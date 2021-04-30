import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import firebase from 'firebase';
import firestore = firebase.firestore;
import { message } from "../models/message";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private db: AngularFirestore) { }

  getNewID() {
    return this.db.createId();
  }

  createDoc(data: any, path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.db.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  getDocbyParameter<tipo>(path: string, parameter: any, valueParameter: any) {
    const datacollection: AngularFirestoreCollection<tipo> =
      this.db.collection<tipo>(path, (ref) => ref.where(parameter, '==', valueParameter));
    return datacollection.valueChanges()[0];
  }

  getCollection<tipo>(path: string) {
    const collection = this.db.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionbyParameter<tipo>(path: string, parameter: any, valueParameter: any) {
    const dataCollection: AngularFirestoreCollection<tipo> = this.db.collection<tipo>(
      path, (ref) => ref.where(parameter, '==', valueParameter));
    return dataCollection.valueChanges();
  }

  getCollectioninArray<tipo>(path: string, parameter: any, valueParameter: any) {
    const dataCollection: AngularFirestoreCollection<tipo> = this.db.collection<tipo>(
      path, (ref) => ref.where(parameter, 'array-contains', valueParameter));
    return dataCollection.valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }



//Servicio para el chat
  getChatRoom( chat_id : string){
    return this.db.collection('ChatRooms').doc(chat_id).valueChanges()
  }//Retorna el id del chatRoom

  sendMsgToFirebase( message : message, chat_id : string){

    this.db.collection('ChatRooms').doc(chat_id).update({
      messages : firestore.FieldValue.arrayUnion(message),
    })}//Manda los menmsajes a la BD



}
