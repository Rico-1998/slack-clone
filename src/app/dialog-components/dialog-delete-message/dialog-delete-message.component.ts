import { Component, Input, OnInit } from '@angular/core';
import { doc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, getFirestore } from '@firebase/firestore';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { DeleteDialogService } from 'src/app/services/delete-dialog.service';

@Component({
  selector: 'app-dialog-delete-message',
  templateUrl: './dialog-delete-message.component.html',
  styleUrls: ['./dialog-delete-message.component.scss']
})
export class DialogDeleteMessageComponent implements OnInit {
  messageId: any;
  db: any = getFirestore();
  @Input() messagePath;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteMessageComponent>,
    public deleteDialogService: DeleteDialogService,
    public channelService: ChannelService,
    public chatService: ChatService,
  ) { }

  ngOnInit(): void {
  }


  closeDialog() {
    this.dialogRef.close();
  }


  //** delete the picked message out of firebase server */
  async deleteMessage() {
    if (this.deleteDialogService.currentMessage['documentId']) {
      await deleteDoc(doc(this.db, 'chats', this.deleteDialogService.currentMessage.id, 'messages', this.deleteDialogService.currentMessage.documentId));
      this.dialogRef.close();
    } else if (!this.deleteDialogService.currentMessage['documentId']) {
      await deleteDoc(doc(this.db, 'channels', this.channelService.channelId, 'messages', this.deleteDialogService.currentMessage.id));
      this.dialogRef.close();
    }
  }
}
