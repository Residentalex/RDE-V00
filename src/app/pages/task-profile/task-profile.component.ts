import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Chat} from 'src/app/models/chat';
import {Person} from 'src/app/models/person';
import {ServicesPerson} from 'src/app/models/services-person';
import {FirebaseAuthService} from 'src/app/services/firebase-auth.service';
import {FirestoreService} from 'src/app/services/firestore.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-task-profile',
  templateUrl: './task-profile.component.html',
  styleUrls: ['./task-profile.component.scss'],
})
export class TaskProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService
  ) {
  }

  taskerName: string;
  person: Person = {};
  tasker: ServicesPerson = {};

  newChat: Chat = {};
  uid: string = '';


  ngOnInit() {

    this.fAuth.stateAuth().subscribe(r => {
      if (r) {
        this.uid = r.uid;
      }

    });

    const idPerson = this.route.snapshot.params.id;
    this.getPerson(idPerson);


  }


  getPerson(id: string) {
    this.db.getDoc<Person>('Personas', id).subscribe(r => {
      if (r) {
        this.person = r;
        this.taskerName = r.name + ' ' + r.lastName;
        this.db.getCollectionbyParameter('ServicioPersona', 'idPerson', r.idPerson).subscribe(r => {
          this.tasker = r[0];
        });
      }
    });
  }

  contact() {

    //Paso los datos del chat
    this.newChat.idperson = this.uid; //el id del que esta logueado
    this.newChat.idtasker = this.tasker.idPerson; //id de la persona que seleccione(colaborador)
    this.newChat.idchat = this.tasker.idPerson; // el id del chat

    //Hago una busqueda en la base de datos (coleccion) 'ChatRooms', donde yo soy el que esta logueado
    //
    this.db.getCollectionby2Parameter('ChatRooms', 'idtasker', this.tasker.idPerson, 'idperson', this.uid)
      .pipe(take(1)).subscribe(datos => { // solo observa una sola vez

        //si hay algun dato por lo menos 1
      if (datos.length) {

        this.router.navigate(['/chat', this.tasker.idPerson]);

      } else {
        //aqui hago una busqueda donde yo soy el colaborador
        this.db.getCollectionby2Parameter('ChatRooms', 'idtasker', this.uid, 'idperson', this.tasker.idPerson)
          .pipe(take(1))
          .subscribe(datos => {
            if (datos.length){
              this.router.navigate(['/chat', this.uid]);
            }else{
              this.db.createDoc(this.newChat,"ChatRooms",this.newChat.idchat).then(()=> {
                this.router.navigate(["/chat", this.tasker.idPerson]);
              })
            }
          });
      }

    });
  }

}
