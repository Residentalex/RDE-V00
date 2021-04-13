import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetServicesComponent } from './set-services/set-services.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesListComponent } from './services-list/services-list.component';



@NgModule({
  declarations: [
    SetServicesComponent,
    ServicesListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BackendModule { }
