import { Component, OnInit } from '@angular/core';
import { collection, doc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc } from '@firebase/firestore';
import { ChatService } from '../services/chat.service';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  currentChat: any;
  currentChatMembers: any;
  // currentchatMessages = [];
  textBoxPath: string = 'chatroom';


  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(chatroomId => {
      this.chatService.getChatRoom(chatroomId);
    });
  }

}
