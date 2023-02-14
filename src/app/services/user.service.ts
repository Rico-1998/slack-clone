import { Injectable } from '@angular/core';
import { docData, Firestore, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, onSnapshot } from '@firebase/firestore';
import { Observable, of, switchMap } from 'rxjs';


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
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.users.push({ ...(change.doc.data() as object), id: change.doc.id });
        } else if (change.type === 'modified') {
          let userToEdit = this.users.filter(m => m.id == change.doc.id);
          userToEdit[0]['loggedIn'] = change.doc.data()['loggedIn'];
        }
      })
    },
      (error) => {
        console.warn('Loading all users error', error);
      })


    this.authService.loggedUser?.subscribe((user$) => {
      if (user$) {
        getDoc(doc(this.userRef, user$.uid as string))
          .then((user) => {
            this.currentUser = user.data();
          })
      }
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
    getDocs(this.userRef);
  }
}
