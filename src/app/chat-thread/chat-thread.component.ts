import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { getFirestore } from '@firebase/firestore';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss']
})
export class ChatThreadComponent implements OnInit {

  db = getFirestore();
  message: any;
  allComments: any[] = []
  textBoxPath: string = 'chat-thread';

  constructor(
    public channel: ChannelService,
    public chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.channel.threadLoading = true;
  }

  closeThread() {
    this.chatService.threadOpen = false;
  }

}
