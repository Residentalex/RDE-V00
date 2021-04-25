import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasker-tools',
  templateUrl: './tasker-tools.component.html',
  styleUrls: ['./tasker-tools.component.scss'],
})
export class TaskerToolsComponent implements OnInit {

  tools = [];

  tool: string;

  constructor() { }

  ngOnInit() {}

  saveTool(){
    this.tools.push(this.tool);
    this.tool = '';
  }

  deleteTool(tool: string){
    this.tools = this.tools.filter( function (t) {
      return t != tool
    })
  
  }

}
