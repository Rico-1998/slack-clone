import { Component, OnInit } from '@angular/core';
import { Firestore, limit, onSnapshot, orderBy } from '@angular/fire/firestore';
import { collection, getDocs, getFirestore, query } from '@firebase/firestore';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  allUsers = [];
  db: any = getFirestore();
  colref: any = collection(this.db, 'users');
  sortedUser: any = query(this.colref, orderBy('name'), limit(5));

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    let data = [];
    onSnapshot(this.colref, ((snapshot) => {
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      })
      for (let i = 0; i < data.length; i++) {
        if (data[i].userName !== 'guest') {
          this.allUsers.push(data[i]);
        }
      }
    }));
  }

  createChat(id: string) {
    console.log(id);

  }


}
