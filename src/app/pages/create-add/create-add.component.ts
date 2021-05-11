import { Component, OnInit } from '@angular/core';
import { Add } from 'src/app/models/add';

@Component({
  selector: 'app-create-add',
  templateUrl: './create-add.component.html',
  styleUrls: ['./create-add.component.scss'],
})
export class CreateAddComponent implements OnInit {

  add: Add;

  constructor() { }

  ngOnInit() {}

}
