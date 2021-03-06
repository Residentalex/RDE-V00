import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';
import { ServicesComponent } from './services/services.component';
import { TaskerSkillsComponent } from "./tasker-skills/tasker-skills.component";
import { TaskerToolsComponent } from './tasker-tools/tasker-tools.component';
import { ServicesPersonListComponent } from './services-person-list/services-person-list.component';
import { TaskProfileComponent } from "./task-profile/task-profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { PublishAddComponent } from "./publish-add/publish-add.component";
import { AddComponent } from './add/add.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ActivitiesComponent } from './activities/activities.component';



@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    ServicesComponent,
    TaskerSkillsComponent,
    TaskerToolsComponent,
    ServicesPersonListComponent,
    TaskProfileComponent,
    ChangePasswordComponent,
    PublishAddComponent,
    AddComponent,
    ChatRoomComponent,
    ActivitiesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ServicesComponent
  ]
})
export class PagesModule { }
