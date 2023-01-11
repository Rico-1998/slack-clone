import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8


import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})
export class NavTreeComponent implements OnInit {
  openChannelPanel = false;
  openChatsPanel = false;
  db = getFirestore();

  channels: any = [];
  chats: string[] = ['Tobias', 'Rico', 'Phil', 'Viktor'];

  constructor(
    public dialog: MatDialog,
    // private angularFirestore: AngularFirestore, //Tobi added Firestore version 8
  ) { }

  ngOnInit(): void {
    // this.angularFirestore
    //   .collection('channels')
    //   .valueChanges({ idField: 'customIdName' })
    //   .subscribe((change) => {
    //     this.channels = change;
    //     console.log(this.channels);
    //   })

    onSnapshot(collection(this.db, 'channels'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.channels.push(({ ...(doc.data() as object), id: doc.id }));
      })
      // console.log(this.channels);
    })


    let currentUserId = JSON.parse(localStorage.getItem('user'));
    getDoc(doc(this.db, 'users', currentUserId.uid))
      .then((doc) => {
        // console.log(doc.data());
      })

  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

}
