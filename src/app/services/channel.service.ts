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
  channelRef: any;
  currentChannel: any = '';
  newMessage: Message;
  userName: string;
  allMessages: any = [];

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
  ) { }


  // getChannelRoom(){
  //   this.route.params.subscribe((params) => {
  //     this.channelId = params['id'];
  //     let document = doc(this.db, 'channels', this.channelId);
  //     getDoc(document)
  //       .then((doc) => {
  //         this.currentChannel = doc.data();
  //       })
  //   })
  // }

  
  postInChannel() {
    this.saveMsg();
    // this.loadMessagesInChannel();
  }


  saveMsg() {
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage
    })
      .then(() => {
        alert('message added to firebase channel')
      });
  }


  loadMessagesInChannel() {
    onSnapshot(this.channelRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.allMessages.push({ ...(doc.data() as object), id: doc.id });
      })
    })
    console.log(this.allMessages);
  }
  
}
