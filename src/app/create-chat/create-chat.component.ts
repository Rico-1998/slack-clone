import { Component, OnInit, HostListener, Input, ViewChild, ElementRef } from '@angular/core';
import { addDoc, doc, Firestore, query, getDoc, getDocs, getFirestore, onSnapshot, setDoc, where, orderBy, docData } from '@angular/fire/firestore';
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
  lastMessages = {
    "name": "Phil Schmucker",
    "date": '09.01.2022',
    "message": 'Du: Das ist eine Testnachricht!',
  }

  value: any;
  db = getFirestore();
  textBoxPath: string = 'create-chat';
  @ViewChild('usersField') userField: any;
  chatDocs: object[] = [];



  constructor(public toggler: DrawerTogglerService,
    private firestore: Firestore,
    public userService: UserService,
    public chatService: ChatService,
    private cdref: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.userService.chatEditor = true;
    this.userService.channelEditor = false;
    onSnapshot(collection(this.db, 'chats'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.chatDocs.push(({ ...(doc.data() as object), chatIdDoc: doc.id }));
      })
    })

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewportWidth = event.target.innerWidth > 600 ? false : true;
  }


  //**search for registrated user in database */
  searchUser(event: any) {
    this.chatService.foundedUsers = event;
  }

}
