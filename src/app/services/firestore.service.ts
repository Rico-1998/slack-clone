import { Injectable, Injector } from '@angular/core';
import { getFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentMessage: any;
  db = getFirestore();

  constructor(
    public dialog: MatDialog,
    public channelService: ChannelService,
  ) { }

//** open dialog for confirming to delete message */
openDeleteMessageDialog(message) {
  this.currentMessage = message;
  this.dialog.open(DialogDeleteMessageComponent, {
    panelClass: 'delete-message'
  })
}

spliceDeletedMessage() {
  let index = this.channelService.allMessages.findIndex(a => a.id == this.currentMessage.id);
  this.channelService.allMessages.splice(index, 1);
}
  
}
