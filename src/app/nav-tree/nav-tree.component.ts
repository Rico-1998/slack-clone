import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
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
  q1 = query(collection(this.db, 'chats'), where('userIds', 'array-contains', this.currentUser.uid))
  channels: any = [];
  chats: string[] = ['Tobias', 'Rico', 'Phil', 'Viktor'];

  constructor(
    public dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    onSnapshot(collection(this.db, 'channels'), (snapshot) => {
      this.channels = [];
      snapshot.docs.forEach((doc) => {
        this.channels.push(({ ...(doc.data() as object), id: doc.id }));
      })
    })


    getDocs(this.q1)
      .then((docData) => {
        docData.docs.forEach((user) => {
          console.log(user.data());
        })
      })
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

}
