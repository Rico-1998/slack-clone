import { Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../../modules/messages.class';
import { Channel } from '../../modules/channels.class';
import { arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  user: any;
  currentUser: any;
  userID: any;
  allChannels: any;
  channelID: any = '';
  currentChannel: any;
  channel: Channel = new Channel();
  messageInput: any;
  newMessage: any;
  message: Message = new Message();
  messages: any = [];
  currentMessage: any;
  indexOfMessage: number;
  filteredMessages: Array<any>;


  constructor(
    private firestore: AngularFirestore,
    private injector: Injector,
  ) { }


  postMessage(){
    this.message = new Message ({
      message: this.messageInput,
    })
    this.firestore
      .collection('channels')
      .doc(this.channelID)
      .update({
        messages: arrayUnion(this.message.toJson()),
      });
  }
}
