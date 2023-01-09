import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../dialog-components/dialog-error/dialog-error.component';
import { Firestore, getFirestore, collection, getDocs, onSnapshot, addDoc, query, where, orderBy, serverTimestamp, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { DialogSuccessMessageComponent } from '../dialog-components/dialog-success-message/dialog-success-message.component';
import { Router } from '@angular/router';
import { setDoc } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: object;
  auth: any = getAuth();
  errorMessage: string;
  errorCode: any;
  loggedIn: boolean = false;
  db: any = getFirestore();
  colRef: any = collection(this.db, 'users');
  loggedUser: Observable<any> = authState(this.auth);


  constructor(public dialog: MatDialog,
    private firestore: Firestore,
    private router: Router
  ) {
    this.isLoggedIn();
    onAuthStateChanged(this.auth, (user) => {
      // console.log('user status changed:', user);
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })

  }


  guestLogin() {
    signInAnonymously(this.auth)
      .then((guest) => {
        // console.log(guest);
        setDoc(doc(this.colRef, guest.user.uid), {
          userName: 'guest',
        });
        this.loggedIn = true;
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        this.handleError(e.message, e.code);
      })
  }


  isLoggedIn(): any {
    const user = JSON.parse(localStorage.getItem('user')!);

    if (user !== null && !user?.isAnonymous) {
      this.loggedIn = true
    } else {
      this.loggedIn = false
    }
  }


  registrateUser(email: string, password: string, name: string, form: any) {
    let emailUser = email;
    let passwordUser = password;

    createUserWithEmailAndPassword(this.auth, email, password)
      // cred ist ein user credentional object
      .then((cred) => {
        // console.log('user created:', cred.user);
        setDoc(doc(this.colRef, cred.user.uid), {
          userName: name,
        });
        this.dialog.open(DialogSuccessMessageComponent);
        form.reset();
      })
      .catch((e) => {
        this.handleError(e.message, e.code);
      })

  }


  logout() {
    signOut(this.auth)
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        this.handleError(e.message, e.code);
      })
  }


  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((cred) => {
        console.log('user logged in:', cred.user)
        this.loggedIn = true;
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        this.handleError(e.message, e.code);
      })
  }


  handleError(eMessage: any, eCode: any) {
    this.errorMessage = eMessage;
    this.errorCode = eCode;
    this.dialog.open(DialogErrorComponent);
  }
}
