import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { doc, docData, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';



@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})
export class NavTreeComponent implements OnInit {
  openChannelPanel = false;
  openChatsPanel = false;
  db = getFirestore();
  currentUser = JSON.parse(localStorage.getItem('user'));
  currentUserChats = query(collection(this.db, 'chats'), where('userIds', 'array-contains', this.currentUser.uid));
  channels: any = [];

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public chatService: ChatService,

  ) { }

  ngOnInit(): void {
    // onSnapshot(this.currentUserChats, async (snapshot) => {
    //   this.chatService.chats = [];
    //   snapshot.docs.forEach((doc) => {
    //     let otherUsers = (doc.data()['userIds'].filter(a => a != this.currentUser.uid));
    //     this.chatService.chats.push(({ ...(doc.data() as object), chatRoomId: doc.id, otherUsers: otherUsers }));
    //   });
    //   console.log(this.chatService.chats);
    //   // kann man vielleicht noch auf die find methode umbauen und damit verkürzen
    //   for (let i = 0; i < this.chatService.chats.length; i++) {
    //     let otherUsers = this.chatService.chats[i].otherUsers;
    //     for (let i = 0; i < otherUsers.length; i++) {
    //       const actualMember = otherUsers[i];
    //       await getDoc(doc(this.db, 'users', actualMember))
    //         .then((docData) => {
    //           let index = otherUsers.indexOf(actualMember);
    //           otherUsers[index] = docData.data();
    //         })
    //     }
    //   }
    // });
    this.chatService.getChats();

    onSnapshot(collection(this.db, 'channels'), (snapshot) => {
      this.channels = [];
      snapshot.docs.forEach((doc) => {
        this.channels.push(({ ...(doc.data() as object), id: doc.id }));
      })
    });
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

}
