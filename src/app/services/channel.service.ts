import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, timestamp } from 'rxjs';
import { addDoc, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, Timestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { Message } from 'src/modules/messages.class';
import { ChannelsComponent } from '../channels/channels.component';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channelId: string;
  db: any = getFirestore();
  newMessage: Message;
  threadId: any; //In use 
  threadOpen: boolean = false; // In use

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
  ) { }


  postInChannel() {
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage
    })
      .then(() => {
        // alert('message added to firebase channel')
      });
  }


}
