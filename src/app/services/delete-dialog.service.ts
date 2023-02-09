import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from './channel.service';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';

@Injectable({
  providedIn: 'root'
})
export class DeleteDialogService {
  currentMessage: any;

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
}
