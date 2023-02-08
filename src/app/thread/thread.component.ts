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
  public textBoxPath: string = 'thread';

  constructor(
    public channelService: ChannelService,
  ) {}

  ngOnInit(): void {
    this.channelService.threadLoading = true;    
  } 

}
