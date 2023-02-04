import { Component, Input, OnInit } from '@angular/core';
import { doc, documentId } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, getFirestore } from '@firebase/firestore';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

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
    public service: FirestoreService,
    public channel: ChannelService,
  ) { }

  ngOnInit(): void {
    console.log(this.service.currentMessage);
  }


  closeDialog() {
    this.dialogRef.close();
  }


  //** delete the picked message out of firebase server and array */
  async deleteMessage() {
    if (this.service.currentMessage['documentId']) {
      // let actualMsg = doc(this.service.db, 'chats', this.service.currentMessage.id, 'messages', this.service.currentMessage.documentId);
      // console.log('Message from CHATROOM', actualMsg);
      await deleteDoc(doc(this.service.db, 'chats', this.service.currentMessage.id, 'messages', this.service.currentMessage.documentId));

      this.dialogRef.close();
    } else if (!this.service.currentMessage['documentId']) {
      // console.log('Message from CHANNEL', actualMsgChannel);
      // this.channel.allMessages = this.channel.allMessages.filter(item => item.id !== this.channel.messageId)
      await deleteDoc(doc(this.db, 'channels', this.channel.channelId, 'messages', this.channel.messageId));
      this.service.spliceDeletedMessage()
      this.dialogRef.close();
    }
  }
}
