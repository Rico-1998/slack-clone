import { Component, Input, OnInit } from '@angular/core';
import { doc, documentId } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, getFirestore } from '@firebase/firestore';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-dialog-delete-message',
  templateUrl: './dialog-delete-message.component.html',
  styleUrls: ['./dialog-delete-message.component.scss']
})
export class DialogDeleteMessageComponent implements OnInit {
  messageId: any;
  db: any = getFirestore();
  @Input() textBoxPath;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteMessageComponent>,
    public channel: ChannelService,
    public chat: ChatService,
  ) { }

  ngOnInit(): void {
    console.log(this.channel.currentMessage);
  }


  closeDialog() {
    this.dialogRef.close();
  }


  //** delete the picked message out of firebase server and array */
  async deleteMessage() {
    if (this.channel.currentMessage['documentId']) {
      console.log('Message from CHATROOM');
      // let actualMsg = doc(this.chat.db, 'chats', message.id.id, 'messages', message.documentId);
    // await deleteDoc(actualMsg);
    } else {
      console.log('Message from CHANNEL');
      // await deleteDoc(doc(this.db, 'channels', this.channel.channelId, 'messages', this.channel.messageId));
      // this.channel.allMessages = this.channel.allMessages.filter(item => item.id !== this.channel.messageId)
      // this.dialogRef.close();
      }
    }
}
