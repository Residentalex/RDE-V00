import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

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

  async getDoc<tipo>(path: string, id: string) {
    const collection = await this.db.collection<tipo>(path).doc(id).valueChanges().pipe(first()).toPromise();
    return collection;
  }

  getDocbyParameter<tipo>(path: string, parameter: any, valueParameter: any) {
    const datacollection: AngularFirestoreCollection<tipo> =
      this.db.collection<tipo>(path, (ref) => ref.where(parameter, '==', valueParameter));
    return datacollection.valueChanges()[0];
  }

  async getCollection<tipo>(path: string) {
    const collection = await this.db.collection<tipo>(path).valueChanges().pipe(first()).toPromise();
    return collection;
  }

  async getCollectionbyParameter<tipo>(path: string, parameter: any, valueParameter: any) {
    const dataCollection = await this.db.collection<tipo>(
      path, (ref) => ref.where(parameter, '==', valueParameter)).valueChanges().pipe(first()).toPromise();
    return dataCollection;
  }

  getCollectionby2Parameter<tipo>(path: string, parameter: any, valueParameter: any, parameter2: any, value2: any) {
    const dataCollection: AngularFirestoreCollection<tipo> = this.db.collection<tipo>(
      path, (ref) => ref.where(parameter, '==', valueParameter).where(parameter2, '==', value2));
    return dataCollection.valueChanges();
  }

  async getCollectioninArray<tipo>(path: string, parameter: any, valueParameter: any) {
    const dataCollection = await this.db.collection<tipo>(
      path, (ref) => ref.where(parameter, 'array-contains', valueParameter)).valueChanges().pipe(first()).toPromise();
    return dataCollection;
  }

  deleteDoc(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }

}
