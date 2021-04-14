import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    private auth: AngularFireAuth
  ) { }


  createUserWithEmailandPassword(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }


  loginWithEmailandPassword(email: string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.auth.signOut;
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if(user === undefined){
      return null
    }else {
      return user.uid;
    }
  }
}
