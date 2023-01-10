import { Component, OnInit, HostListener } from '@angular/core';
import { Firestore, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { UserService } from '../services/user.service';


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
  searchedUSers = [];

  constructor(public toggler: DrawerTogglerService, private firestore: Firestore, private userService: UserService) { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewportWidth = event.target.innerWidth > 600 ? false : true;
  }

  searchUser(event: any) {
    this.userService.users.forEach((user, index) => {
      let users: string = user.userName.toLowerCase();
      if (users.startsWith(event.key.toLowerCase() as string)) {
        this.searchedUSers.push(user.userName);
      }
    });
  }

}
