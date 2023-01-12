import { Component, OnInit, HostListener } from '@angular/core';
import { addDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { UserService } from '../services/user.service';
import { ChangeDetectorRef } from '@angular/core';



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
  DataContext: any;
  Position: any;
  chatDocs: object[] = [];

  constructor(public toggler: DrawerTogglerService, private firestore: Firestore, public userService: UserService, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
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

  searchUser(event: any) {
    this.foundedUsers = event;
  }

  async createChat(userYouWantToChat: any) {
    this.foundedUsers = [];
    // let chatDoc = await getDocs((collection(this.db, 'chats')))
    // chatDoc.forEach((doc) => {
    //   chatDocs.push({ ...(doc.data() as object), chatIdDoc: doc.id });
    // });


    if (this.chatDocs.length == 0) {
      addDoc(collection(this.db, 'chats'), {
        name: 'rico',
        msg: 'test',
        userId: [this.userService.currentUser.id, userYouWantToChat]
      })
    } else {
      let el;
      for (let i = 0; i < this.chatDocs.length; i++) {
        el = this.chatDocs[i];
      }
      if (el['userId'].includes(this.userService.currentUser.id && userYouWantToChat)) {
        console.log(el['chatIdDoc']);

      } else {
        addDoc(collection(this.db, 'chats'), {
          name: 'rico',
          msg: 'test',
          userId: [this.userService.currentUser.id, userYouWantToChat]
        })
      }


      // chatDocs.forEach((element, index) => {
      //   if (!element['userId'].includes(userYouWantToChat) && !element['userId'].includes(this.userService.currentUser.id)) {
      //     console.log('klappt');
      // addDoc(collection(this.db, 'chats'), {
      //   name: 'rico',
      //   msg: 'test',
      //   userId: [this.userService.currentUser.id, userYouWantToChat]
      // })
      //   }
      // })
    }

    // .then((doc) => {
    //   console.log(doc.docs.map(data => data.data() as object, ))
    // })




  }

  ngAfterContentChecked() {

    this.userService.users.DataContext = this.DataContext;
    this.userService.users.Position = this.Position;
    this.cdref.detectChanges();

  }

}
