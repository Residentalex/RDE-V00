import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Add } from 'src/app/models/add';
import { Person } from 'src/app/models/person';
import { FirestoreService } from 'src/app/services/firestore.service';

declare var google;


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  add: Add = {}
  person: Person = {}

  map = null;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService
  ) { }

  async ngOnInit() { 
    const id = await this.route.snapshot.params.id;
    this.add = await this.getAdd(id);
    this.person = await this.getPerson(this.add.idPerson);
    this.loadMap();
  }

  async getAdd(id: string) {
    const add = await this.db.getDoc<Add>('Anuncios', id);
    return add
  }

  async getPerson(id: string){
    const person = await this.db.getDoc('Personas', this.add.idPerson);
    return person
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 4.658383846282959, lng: -74.09394073486328};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

}
