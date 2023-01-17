import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Message } from 'src/modules/messages.class';
import { timestamp } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteMessageComponent } from '../dialog-components/dialog-delete-message/dialog-delete-message.component';
// import { query } from '@angular/animations';


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
  showBtn: boolean = false;

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    route.params.subscribe(val => {
      this.getChannelRoom();
    });
  }


  ngOnInit() {
    this.user.channelEditor = true;
    this.user.chatEditor = false;
    this.getChannelRoom();
  }


  async getChannelRoom() {
    this.route.params.subscribe((params) => {
      this.channel.channelId = params['id'];
    })
    let document = doc(this.db, 'channels', this.channel.channelId);
    await getDoc(document)
      .then((doc) => {
        this.currentChannel = doc.data();
        this.currentChannel.created = this.channel.convertTimestamp(this.currentChannel.created, 'onlyDate')
        console.log(this.channel.channelId);
      })
    this.loadMessagesInChannel();
  }


  async loadMessagesInChannel() {
    this.allMessages = [];
    const colRef = collection(this.db, 'channels', this.channel.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    await onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.allMessages.find(m => m.id == doc.id)) {
          let message = { ...(doc.data() as object), id: doc.id };
          message['timestamp'] = this.channel.convertTimestamp(message['timestamp'], 'full');
          this.allMessages.push(message);
        }
      })
    })

    // await onSnapshot(collection(this.db, 'channels', this.channelId, 'messages'), (snapshot) => {
    //   snapshot.docs.forEach((doc) => {
    //     if (!this.allMessages.find(m => m.id == doc.id)) {
    //       const message = { ...(doc.data() as object), id: doc.id };
    //       message['timestamp'] = this.convertTimestamp(message['timestamp'], 'full');
    //       console.log(message['timestamp'])
    //       this.allMessages.push(message);
    //     }
    //   })
    // })
    // console.log(this.channelId == this.route['params']['_value'].id);

  }


  postInChannel() {
    this.saveMsg();
  }


  saveMsg() {
    // let timestamp = Timestamp.fromDate(new Date()).toDate();
    let timestamp = serverTimestamp();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      msg: this.newMessage
    })
      .then(() => {
        alert('message added to firebase channel')
        // this.loadMessagesInChannel(); nachrichten werden automatisch geladen
      });
  }


  openDeleteMessageDialog() {
    this.dialog.open(DialogDeleteMessageComponent);
  }


  deleteMessage() {
    console.log(this.allMessages);
  }


  openThread(id) {
    this.channel.threadId = id;
    this.channel.threadOpen = true;
    this.channel.loadCommentsToThread();
    this.channel.loadMessageToThread();
  }

}
