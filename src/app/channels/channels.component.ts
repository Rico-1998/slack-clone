import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Message } from 'src/modules/messages.class';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  db = getFirestore();
  channelId: any;
  currentChannel: any;
  allMessages: any[] = [];
  newMessage: Message;

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService
  ) { }


  ngOnInit() {
    this.user.channelEditor = true;
    this.user.chatEditor = false;
    this.getChannelRoom();
  }


  async getChannelRoom() {
    this.route.params.subscribe((params) => {
      this.channelId = params['id'];
    })
    let document = doc(this.db, 'channels', this.channelId);
    await getDoc(document)
      .then((doc) => {
        this.currentChannel = doc.data();
        console.log(this.channelId);
      })
    this.loadMessagesInChannel();
  }


  async loadMessagesInChannel() {
    await onSnapshot(collection(this.db, 'channels', this.channelId, 'messages'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.allMessages.find(m => m.id == doc.id)) {
          this.allMessages.push({ ...(doc.data() as object), id: doc.id });
        }
      })
    })
    console.log(this.allMessages);
  }


  postInChannel() {
    this.saveMsg();
    this.addNewMsg();
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



  async addNewMsg() {
    await onSnapshot(collection(this.db, 'channels', this.channelId, 'messages'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.allMessages.find(m => m.id == doc.id)) {
          this.allMessages.push({ ...(doc.data() as object), id: doc.id });
        }
      })
    })
    console.log(this.allMessages);
  }

}
