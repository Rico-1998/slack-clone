import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { collection, onSnapshot } from '@firebase/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: object;
  users: any = [];

  constructor(public authService: AuthService, private firestore: Firestore) { }

  ngOnInit(): void {
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.users.push({ ...(doc.data() as object), id: doc.id })
      })
    })

  }


}
