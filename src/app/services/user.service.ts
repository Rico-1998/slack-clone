import { Injectable } from '@angular/core';
import { docData, Firestore, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, onSnapshot } from '@firebase/firestore';
import { filter, map, Observable, switchMap } from 'rxjs';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<any>;
  currentUser: any;
  users: any = [];
  ref: any = collection(this.firestore, 'users');

  constructor(
    public authService: AuthService, 
    private firestore: Firestore,
    public firestoreService: FirestoreService) {
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.users.push({ ...(doc.data() as object), id: doc.id });       
      })
    })

    this.authService.loggedUser.subscribe((user$) => {
      this.currentUser$ = user$;
      getDoc(doc(this.firestore, 'users', user$.uid as string))
        .then((user) => {
          this.currentUser = user.data();
          console.log(this.currentUser);
        })
    })
  }


  getData() {
    getDocs(this.ref)
      .then((response) => {
        // console.log(response.docs.map(docs => docs.data()));
      })
    // console.log('das ist der Current User:', this.currentUser);

  }
}
