import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import {Comments} from '../../modules/comments.class'
import { doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  db = getFirestore();
  message: any;
  allComments: any[] = []

  constructor(
    public channel: ChannelService,
  ) { }

  ngOnInit(): void {
    this.channel.threadLoading = true;
    // this.channel.loadCommentsToThread()
    // this.channel.loadMessageToThread()
  }

  // async loadComments() {
  //   this.allComments = [];
  //   const colRef = collection(this.db, 'channels', this.channel.channelId, 'messages', this.channel.threadId, 'comments');
  //   const q = query(colRef, orderBy('timestamp'));
  //   await onSnapshot(q, (snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       let comment = {...(doc.data() as object), id: doc.id};
  //       comment['timestamp'] = this.channel.convertTimestamp(comment['timestamp'], 'full');
  //       this.allComments.push(comment);
  //       console.log(this.allComments)
  //     })
  //   })
  // }

}
