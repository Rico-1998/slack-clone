import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { addDoc, doc, getDoc, getDocs } from '@angular/fire/firestore';
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
  textBoxPath: string = 'channels';

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
      })
    this.loadMessagesInChannel();
  }


  async loadMessagesInChannel() {
    this.allMessages = [];
    const colRef = collection(this.db, 'channels', this.channel.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    await onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(async (doc) => {
        if (!this.allMessages.find(m => m.id == doc.id)) {
          let comments = (await getDocs(collection(this.db, 'channels', this.channel.channelId, 'messages', doc.id, 'comments')));
          // let message = { ...(doc.data() as object), id: doc.id, comments: 4};
          let message = { ...(doc.data() as object), id: doc.id, comments: comments.size };
          message['timestamp'] = this.channel.convertTimestamp(message['timestamp'], 'full');
          this.allMessages.push(message);
        }
      })
    })
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
