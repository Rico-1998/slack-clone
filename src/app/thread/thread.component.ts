import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { collection, getFirestore, onSnapshot, Timestamp, orderBy, query, serverTimestamp } from '@firebase/firestore';
import { Comments } from '../../modules/comments.class'
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
  public textBoxPath: string = 'thread';

  constructor(
    public channel: ChannelService,
  ) { }

  ngOnInit(): void {
    this.channel.threadLoading = true;
  }

  closeThread() {
    this.channel.threadOpen = false;
    this.channel.allThreadComments = [];
    this.channel.threadMessage = undefined;
    this.channel.threadId = undefined;
  }

}
