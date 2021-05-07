import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ServicesListComponent } from './backend/services-list/services-list.component';
import { SetServicesComponent } from './backend/set-services/set-services.component';
import { AddComponent } from './pages/add/add.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PublishAddComponent } from './pages/publish-add/publish-add.component';
import { RegisterComponent } from './pages/register/register.component';
import { ServicesPersonListComponent } from './pages/services-person-list/services-person-list.component';
import { TaskProfileComponent } from './pages/task-profile/task-profile.component';
import { TaskerSkillsComponent } from './pages/tasker-skills/tasker-skills.component';
import { TaskerToolsComponent } from './pages/tasker-tools/tasker-tools.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'set-services/:id', component: SetServicesComponent },
  { path: 'set-services', component: SetServicesComponent },
  { path: 'services-list', component: ServicesListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'tasker-skill', component: TaskerSkillsComponent},
  { path: 'tasker-tools', component: TaskerToolsComponent},
  { path: 'tasker-skill', component: TaskerSkillsComponent},
  { path: 'services-person-list', component: ServicesPersonListComponent},
  { path: 'services-person-list/:id', component: ServicesPersonListComponent},
  { path: 'profile/:id', component: TaskProfileComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'publish-add', component: PublishAddComponent},
  { path: 'add/:id', component: AddComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
