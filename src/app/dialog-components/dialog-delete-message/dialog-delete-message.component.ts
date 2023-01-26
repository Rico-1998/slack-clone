import { Component, OnInit } from '@angular/core';
import { doc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, getFirestore } from '@firebase/firestore';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-dialog-delete-message',
  templateUrl: './dialog-delete-message.component.html',
  styleUrls: ['./dialog-delete-message.component.scss']
})
export class DialogDeleteMessageComponent implements OnInit {
  messageId: any;
  db: any = getFirestore();

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteMessageComponent>,
    public channel: ChannelService,
  ) { }

  ngOnInit(): void {
    console.log(this.channel.currentMessage);
  }


  closeDialog() {
    this.dialogRef.close();
  }


  //** delete the picked message out of firebase server and array */
  async deleteMessage() {
    await deleteDoc(doc(this.db, 'channels', this.channel.channelId, 'messages', this.channel.messageId));
    this.channel.allMessages = this.channel.allMessages.filter(item => item.id !== this.channel.messageId)
    this.dialogRef.close();
  }

}
