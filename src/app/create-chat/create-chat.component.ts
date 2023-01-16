import { Component, OnInit, HostListener } from '@angular/core';
import { addDoc, doc, Firestore, query, getDoc, getDocs, getFirestore, onSnapshot, setDoc, where, orderBy } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { UserService } from '../services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { concatMap, map } from 'rxjs';



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
  actualChatDocument: any;

  constructor(public toggler: DrawerTogglerService, private firestore: Firestore, public userService: UserService, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    onSnapshot(collection(this.db, 'chats'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.chatDocs.push(({ ...(doc.data() as object), chatIdDoc: doc.id }));
      })
    })

    let ref = collection(this.db, 'channels', '5jXBSiXLpYQWmpVigKY4', 'messages');
    onSnapshot(ref, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());

      })
    })
    // setTimeout(() => {

    //   const ref: any = collection(this.db, 'chats');
    //   let chats: any = query(ref, where("userId", "array-contains", this.userService.currentUser.id as string))
    //   onSnapshot(chats, (snapshot) => {
    //     snapshot.docs.forEach((doc) => {
    //       console.log(doc.data());

    //     })
    //   })

    // }, 3000);

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
    let chats: any = query(collection(this.db, 'chats'), where("userId", "array-contains", userYouWantToChat), orderBy('userId', 'desc'));
    let abc = await getDocs(chats);
    abc.forEach((doc) => {
      console.log(doc.data());
    })
    // if (abc.docs.length != 0) {
    //   console.log(abc);

    // }


    // if (this.chatDocs.length == 0) {
    //   addDoc(collection(this.db, 'chats'), {
    //     name: 'rico',
    //     msg: 'test',
    //     userId: [this.userService.currentUser.id, userYouWantToChat]
    //   })
    // } else {
    //   this.actualChatDocument = '';
    //   this.actualChatDocument = this.chatDocs.find((n) => n['userId'].includes(this.userService.currentUser.id && userYouWantToChat));
    //   console.log('das ist actualDoc', this.actualChatDocument);

    //   if (this.userService.currentUser.id === userYouWantToChat) {
    //     console.log('same');
    //   } else if (this.actualChatDocument) {
    //     console.log('klappt');
    //   } else {
    //     addDoc(collection(this.db, 'chats'), {
    //       name: 'rico',
    //       msg: 'test',
    //       userId: [this.userService.currentUser.id, userYouWantToChat]
    //     })
    //   }

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
    // }

    // .then((doc) => {
    //   console.log(doc.docs.map(data => data.data() as object, ))
    // })




  }

  // ngAfterContentChecked() {

  //   this.userService.users.DataContext = this.DataContext;
  //   this.userService.users.Position = this.Position;
  //   this.cdref.detectChanges();

  // }

}
