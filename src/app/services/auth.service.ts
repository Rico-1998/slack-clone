import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../dialog-components/dialog-error/dialog-error.component';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { DialogSuccessMessageComponent } from '../dialog-components/dialog-success-message/dialog-success-message.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: any = getAuth();
  errorMessage: string;
  errorCode: any;


  constructor(public dialog: MatDialog,
    private firestore: Firestore,
  ) { }

  registrateUser(email, password, form) {
    let emailUser = email;
    let passwordUser = password;

    createUserWithEmailAndPassword(this.auth, email, password)
      // cred ist ein user credentional object
      .then((cred) => {
        console.log('user created:', cred.user);
        this.dialog.open(DialogSuccessMessageComponent);
        form.reset();
      })
      .catch((e) => {
        this.handleError(e.message, e.code)
      })

  }


  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('user signed out');
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
