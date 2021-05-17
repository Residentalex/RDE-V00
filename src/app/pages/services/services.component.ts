import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Add } from 'src/app/models/add';
import { Person } from 'src/app/models/person';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {

  @Input() adds: Add

  person: Person = {};

  lastTime: string;

  constructor(
    private db: FirestoreService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.person = await this.getPerson();
    this.person.name = this.person.name.split(' ')[0];
    this.person.lastName = this.person.lastName.split(' ')[0];
    this.lastTime = this.secondsToHHMMSS(this.adds.createdAt.seconds);
    
  }

  async getPerson(){
    const person = await this.db.getDoc('Personas', this.adds.idPerson);
    return person;
  }
  
  goPageAdd(){
    this.router.navigate(['/add', this.adds.idAdd]);
  }

  secondsToHHMMSS(SavedTime: any) { 
    
    const currentTime = Date.now() / 1000;
    let segundos = Math.floor((currentTime - SavedTime))
    let minutos = Math.floor(segundos / 60 );
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);
    

    if(dias > 0) {
      return 'hace '+ dias +' dias';
    }else if(horas > 0){
      return 'hace '+ horas + ' horas';
    } else if(minutos > 0){
      return 'hace '+ minutos + ' minutos';
    }else {
      return 'Justo ahora'
    }
  }
  
}
