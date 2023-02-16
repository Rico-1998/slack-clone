import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Firestore, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { UserService } from '../services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../services/chat.service';



@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  viewportWidth: any;
  value: any;
  db = getFirestore();
  textBoxPath: string = 'create-chat';
  @ViewChild('usersField') userField: any;
  chatDocs: object[] = [];



  constructor(
    public toggler: DrawerTogglerService,
    public userService: UserService,
    public chatService: ChatService
    ) { }

  ngOnInit(): void {
    this.userService.chatEditor = true;
    this.userService.channelEditor = false;
    this.chatService.selectedUserList = [];
    onSnapshot(collection(this.db, 'chats'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.chatDocs.push(({ ...(doc.data() as object), chatIdDoc: doc.id }));
      })
    },
    (error) => {
      console.warn('Create chat error', error);
      
    });
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewportWidth = event.target.innerWidth > 600 ? false : true;
  }


  //**search for registrated user in database */
  searchUser(event: any) {
    console.log(event);
    
    this.chatService.foundedUsers = event;
  }

}
