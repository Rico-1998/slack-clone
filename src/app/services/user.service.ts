import { Injectable } from '@angular/core';
import { docData, Firestore, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, onSnapshot } from '@firebase/firestore';
import { filter, map, Observable, of, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<any>;
  currentUser: any;
  users: any = [];
  userRef: any = collection(this.firestore, 'users');
  channelEditor: boolean = false;
  chatEditor: boolean = false;
  threadEditor: boolean = false;

  constructor(
    public authService: AuthService,
    private firestore: Firestore) {
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.users.push({ ...(doc.data() as object), id: doc.id });
      })
    })

    this.authService.loggedUser?.subscribe((user$) => {
      getDoc(doc(this.userRef, user$.uid as string))
        .then((user) => {
          this.currentUser = user.data();
          console.log(this.currentUser);
        })
    })

    this.currentUser$ = this.authService.loggedUser.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<any>
      })
    )

  }


  getData() {
    getDocs(this.userRef)
      .then((response) => {
        // console.log(response.docs.map(docs => docs.data()));
      })
    // console.log('das ist der Current User:', this.currentUser);

  }
}
