import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  user: firebase.default.User;


  constructor(
    private auth: AngularFireAuth
  ) { 
    this.getUid();
  }

  

  createUserWithEmailandPassword(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  loginWithEmailandPassword(email: string, password:string){  
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  async getUid(){
    const user = await this.auth.currentUser;
    
    if(user === null ){
      return null
    }else {
      return user.uid;
    }
  }

  stateAuth(){
    return this.auth.authState;
  }


}
