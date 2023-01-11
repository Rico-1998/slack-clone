import { Component, OnInit, HostListener } from '@angular/core';
import { addDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from '@angular/fire/firestore';
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
  foundedUsers: any[] = [];
  value: any;
  db = getFirestore();

  constructor(public toggler: DrawerTogglerService, private firestore: Firestore, public userService: UserService) { }

  ngOnInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewportWidth = event.target.innerWidth > 600 ? false : true;
  }

  searchUser(event: any) {
    this.foundedUsers = event;
  }

  createChat(userYouWantToChat: any) {
    this.foundedUsers = [];
    let chatDoc = getDocs((collection(this.db, 'chats')))
      .then((doc) => {
        console.log(doc.docs.map(data => data.data() as object))
      })

    console.log(chatDoc);


    // addDoc(collection(this.db, 'chats'), {
    //   name: 'rico',
    //   msg: 'test',
    //   userId: [this.userService.currentUser.id, userYouWantToChat]
    // })
  }

}
