import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, onSnapshot } from '@firebase/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<any>;
  users: any = [];

  constructor(public authService: AuthService, private firestore: Firestore) {
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.users.push({ ...(doc.data() as object), id: doc.id })
      })
    })

    this.authService.currentUser.subscribe((user$) => {
      this.currentUser$ = user$;
      // docData(doc(this.firestore, 'users', user$.uid as string)).subscribe((user) => {
      //   this.currentUser$ = user as object;
      //   console.log(this.currentUser$);
      // })
    })
  }
}
