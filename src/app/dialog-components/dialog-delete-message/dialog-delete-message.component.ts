import { Component, Input, OnInit } from '@angular/core';
import { query, collection, doc, documentId, onSnapshot, orderBy, getDocs } from '@angular/fire/firestore';
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
    public channelService: ChannelService,
    public chatService: ChatService,
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
      await deleteDoc(doc(this.db, 'chats', this.service.currentMessage.id, 'messages', this.service.currentMessage.documentId));
      this.chatService.chatId = this.service.currentMessage.id;
      this.dialogRef.close();
    } else if(!this.service.currentMessage['documentId']){
      await deleteDoc(doc(this.db, 'channels', this.channelService.channelId, 'messages', this.service.currentMessage.id));
      this.channelService.channelId = this.channelService.channelId;
      this.dialogRef.close();
      }
    }
}
