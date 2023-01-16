import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { doc, docData, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { UserService } from '../services/user.service';



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
  currentUserChats = query(collection(this.db, 'chats'), where('userIds', 'array-contains', this.currentUser.uid))
  otherChatMembers: any = [];
  channels: any = [];
  chats: any[] = ['Tobias', 'Rico', 'Phil', 'Viktor'];

  constructor(
    public dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    onSnapshot(this.currentUserChats, async (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.otherChatMembers.push(((doc.data()['userIds'].filter(a => a != this.currentUser.uid))))
      })
      for (let i = 0; i < this.otherChatMembers.length; i++) {
        const actualMember = this.otherChatMembers[i][0];
        let q2 = query(collection(this.db, 'users'), where('id', '==', actualMember))
        let userDocs = await getDocs(q2)
          .then((docData) => {
            console.log('das sind die nutzer daten aus users', docData.docs.map(a => a.data()));
          })
      }
    })

    console.log('das ist otherMembers', this.otherChatMembers);
    //DIESE FUNKTION KLAPPT SO DASS MAN SICH NEN PRIVAT CHAT HOLEN KANN ABER WENN MEHR ALS 2 LEUTE IM CHAT SIND
    // DANN FILTERT ER TROTZDEM ALLE NUTZER RAUS UND NICHT QUASI DIE GRUPPEN




    onSnapshot(collection(this.db, 'channels'), (snapshot) => {
      this.channels = [];
      snapshot.docs.forEach((doc) => {
        this.channels.push(({ ...(doc.data() as object), id: doc.id }));
      })
    })
    // getDocs(this.currentUserChats)
    //   .then((docData) => {
    //     this.chats = [];
    //     docData.docs.forEach((user) => {
    //       this.chats.push(({ ...(user.data() as object), id: user.id }));
    //       console.log('chats',this.chats);
    //     });
    //   })
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

}
