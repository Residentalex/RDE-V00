import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  user: firebase.default.User;


  constructor(
    private auth: AngularFireAuth,
    public toastCtrl:ToastController
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

  formValidationLogin(user:string ,password:string)
  {
    if(!user){
      this.showToast("Enter Mail");
      return false;
    }
 
    if(!password){
      this.showToast("Enter Password");
      return false;
    }
 
    return true;
  }

  formValidationRegister(name:string , last_name:string , email:string ,password:string , cpassword:string)
  {
    if(!name){
      this.showToast("Campo Nombre");
      return false;
    }
 
    if(!last_name){
      this.showToast("Campo Apellido");
      return false;
    }

    if(!email){
      this.showToast("Campo Correo");
      return false;
    }

    
    if(!password){
      this.showToast("Campo Contraseña");
      return false;
    }

    if(!cpassword){
      this.showToast("Campo Confirmar Contraseña");
      return false;
    }

    if (password !==cpassword ){
      this.showToast("Las contraseñas no coinciden");
       return false;
    }
 
    return true;
  }
  showToast(messege:string){
 
    this.toastCtrl.create({
      message:messege ,
      duration:3000
    }).then(res=>res.present());
  }


}
