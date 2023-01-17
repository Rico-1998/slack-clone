import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, timestamp } from 'rxjs';
import { addDoc, doc, Firestore, getDoc, orderBy, query, serverTimestamp } from '@angular/fire/firestore';
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
  newComment: Message;
  threadId: any; // In use 
  threadOpen: boolean = false; // In use
  threadMessage: any; // In Use
  threadLoading: boolean = false;
  allThreadComments: any = [];

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

  postComment() {
    this.threadLoading = true;
    let timestamp = Timestamp.fromDate(new Date()).toDate();
    addDoc(collection(this.db, 'channels', this.channelId, 'messages', this.threadId, 'comments'), {
      author: this.user.currentUser['userName'],
      timestamp: timestamp,
      comment: this.newComment
    })
      .then(() => {
        this.threadLoading = false;
        console.log('message added')
      })
  }

  async loadMessageToThread() {
    this.threadLoading = true;
    let document = doc(this.db, 'channels', this.channelId, 'messages', this.threadId);
    await getDoc(document)
      .then((doc) => {
        this.threadMessage = doc.data();
        this.threadMessage['timestamp'] = this.convertTimestamp(this.threadMessage['timestamp'], 'onlyDate');
        this.threadLoading = false;
      })
  }

  async loadCommentsToThread() {
    this.allThreadComments = [];
    const colRef = collection(this.db, 'channels', this.channelId, 'messages', this.threadId, 'comments');
    const q = query(colRef, orderBy('timestamp'));
    await onSnapshot(q, (snapshot) => {
      // console.log(snapshot.docs.length)
      snapshot.docs.forEach((doc) => {
        if (!this.allThreadComments.find(c => c.id == doc.id)) {
          let comment = { ...(doc.data() as object), id: doc.id };
          comment['timestamp'] = this.convertTimestamp(comment['timestamp'], 'full');
          this.allThreadComments.push(comment);
        }
      })
    })
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
    let onlyDate = dd + '/' + (mm + 1) + '/' + yyyy;
    if (type == 'full') {
      return fullDate;
    } else return onlyDate;
  }


}
