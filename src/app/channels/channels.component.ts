import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Message } from 'src/modules/messages.class';
import { timestamp } from 'rxjs';
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

  constructor(
    public user: UserService,
    private route: ActivatedRoute,
    public channel: ChannelService,
    public router: Router,
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
      this.channelId = params['id'];
    })
    let document = doc(this.db, 'channels', this.channelId);
    await getDoc(document)
      .then((doc) => {
        this.currentChannel = doc.data();
        this.currentChannel.created = this.convertTimestamp(this.currentChannel.created, 'onlyDate')
        console.log(this.channelId);
      })
    this.loadMessagesInChannel();
  }


  async loadMessagesInChannel() {
    this.allMessages = [];
    const colRef = collection(this.db, 'channels', this.channelId, 'messages');
    const q = query(colRef, orderBy('timestamp'));
    await onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (!this.allMessages.find(m => m.id == doc.id)) {
          let message = { ...(doc.data() as object), id: doc.id };
          message['timestamp'] = this.convertTimestamp(message['timestamp'], 'full');
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

  openThread(id) {
    console.log('id is:',id)
  }

  convertTimestamp(timestamp, type) {
    let date = timestamp?.toDate();
    let mm = date?.getMonth();
    let dd = date?.getDate();
    let yyyy = date?.getFullYear();
    let hours = date?.getHours();
    let minutes = date?.getMinutes();
    let secondes = date?.getSeconds();
    if (secondes < 10) {
      secondes = '0' + secondes
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    let fullDate = dd + '/' + (mm + 1) + '/' + yyyy + ' ' + hours + ':' + minutes;
    let onlyDate =  dd + '/' + (mm + 1) + '/' + yyyy;
    if(type =='full') {
      return fullDate;
    } else return onlyDate;
  }

}
