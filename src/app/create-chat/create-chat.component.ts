import { Component, OnInit, HostListener } from '@angular/core';
import { DrawerTogglerService } from '../services/drawer-toggler.service';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  viewportWidth: any;
  lastMessages = {
    "name": "Phil Schmucker",
    "date": '09.01.2022',
    "message": 'Du: Das ist eine Testnachricht!',
  }

  constructor(public toggler: DrawerTogglerService) { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
    this.viewportWidth = event.target.innerWidth > 600 ? false : true;    
  } 
}
