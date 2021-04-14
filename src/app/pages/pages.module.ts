import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class PagesModule { }
