import { Injectable, Injector } from '@angular/core';
import { getFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentMessage: any;
  db = getFirestore();

  constructor(
    public dialog: MatDialog,
  ) { }

//** open dialog for confirming to delete message */
openDeleteMessageDialog(message) {
  this.currentMessage = message;
  this.dialog.open(DialogDeleteMessageComponent, {
    panelClass: 'delete-message'
  })
}
  
}
