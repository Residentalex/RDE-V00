import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Add } from 'src/app/models/add';
import { Chat } from 'src/app/models/chat';
import { Marker } from 'src/app/models/marker';
import { Person } from 'src/app/models/person';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
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
  marker: Marker = {}
  chatRoom: Chat = {}
  uid: string = "";

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private fAuth: FirebaseAuthService,
    private geolocation: Geolocation,
    private router: Router
  ) { }

  async ngOnInit() {
    const id = await this.route.snapshot.params.id;
    this.fAuth.stateAuth().subscribe(r => {
      this.uid = r.uid
    })
    this.add = await this.getAdd(id);
    this.person = await this.getPerson(this.add.idPerson);
    this.loadMap(this.add.location.latitude, this.add.location.longitude);
  }

  async getAdd(id: string) {
    const add = await this.db.getDoc<Add>('Anuncios', id);
    return add
  }

  async getPerson(id: string) {
    const person = await this.db.getDoc('Personas', this.add.idPerson);
    return person
  }

  loadMap(lat: number, long: number) {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = new google.maps.LatLng(lat, long);
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 15,
      gestureHandling: "none"
    });

    // google.maps.event.addListenerOnce(this.map, 'idle', () => {
    //   this.addMarker(this.marker);
    //   mapEle.classList.add('show-map');
    // });
  }

  addMarker(marker: Marker) {
    let position = new google.maps.LatLng(marker.lat, marker.long);
    let mapMarket = google.maps.Marker({
      position: position,
      latitude: marker.lat,
      longitude: marker.long,
      title: marker.title
    });

    mapMarket.setMap(this.map);

  }

  async getGeolocation() {
    const position = await this.geolocation.getCurrentPosition()
    return position;
  }

  async onContact() {

    const ChatRooms = await this.db.getCollectionbyParameter<Chat>("ChatRooms", "idAdd", this.add.idAdd);
    const MyChat = await this.db.getCollectionby2Parameter<Chat>('ChatRooms', 'idPerson', this.uid, 'idTasker', this.add.idPerson)
    const otherChat = await this.db.getCollectionby2Parameter<Chat>('ChatRooms', 'idTasker', this.uid, 'idPerson', this.add.idPerson)


      if ((ChatRooms.length && ChatRooms[0].idPerson == this.uid) || (ChatRooms.length && ChatRooms[0].idTasker == this.uid) ){
        this.router.navigate(['/chat', ChatRooms[0].idChat])
      }else {
        this.chatRoom.idPerson = this.uid;
        this.chatRoom.idTasker = this.add.idPerson;
        this.chatRoom.idChat = this.db.getNewID();
        this.chatRoom.idAdd = this.add.idAdd;
        this.db.createDoc(this.chatRoom, "ChatRooms", this.chatRoom.idChat);
        this.router.navigate(['/chat', this.chatRoom.idChat])
      }
  }
}
