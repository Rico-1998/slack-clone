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
  chatMessages = [];

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    public channelService: ChannelService,
  ) {
  }

  ngOnInit(): void {
    this.chatService.getChats();
    setTimeout(() => {
      this.route.params.subscribe(chatroomId => {
        this.getChatRoom(chatroomId);
      });
    }, 1500);
  }

  getChatRoom(chatroomId) {
    this.chatMessages = [];
    let colRef = collection(this.chatService.db, 'chats', chatroomId['id'], 'messages');
    onSnapshot(colRef, (snapshot) => {
      snapshot.docs.forEach((document) => {
        let timestampConvertedMsg = { ...(document.data() as object), id: document.id };
        timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
        this.chatMessages.push(timestampConvertedMsg)
      })
    })
  }

}
