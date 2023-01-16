import { Component, OnInit } from '@angular/core';
import { ChannelsComponent } from 'src/app/channels/channels.component';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { deleteDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-dialog-delete-message',
  templateUrl: './dialog-delete-message.component.html',
  styleUrls: ['./dialog-delete-message.component.scss']
})
export class DialogDeleteMessageComponent implements OnInit {
  messageId: any;

  constructor(
    public channel: ChannelsComponent,
  ) { }

  ngOnInit(): void {
  }

}
