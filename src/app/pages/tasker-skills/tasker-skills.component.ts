import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tasker-skills',
  templateUrl: './tasker-skills.component.html',
  styleUrls: ['./tasker-skills.component.scss'],
})
export class TaskerSkillsComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController
  ) { }

  ngOnInit() { }

  toogleMenu() {
    this.menuCtrl.toggle();
  }

}
