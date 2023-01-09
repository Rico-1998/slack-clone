import { Component, OnInit } from '@angular/core';
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

  channels: string[] = ['allgemein', 'angular', 'random'];
  chats: string[] = ['Tobias', 'Rico', 'Phil'];

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    let currentUserId = JSON.parse(localStorage.getItem('user'));
    getDoc(doc(this.db, 'users', currentUserId.uid))
      .then((doc) => {
        // console.log(doc.data());
      })

  }


}
