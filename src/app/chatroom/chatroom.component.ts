import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  currentChat: any;
  currentChatMembers: any;

  constructor(
    public chatService: ChatService,    
    private route: ActivatedRoute,
    ) { 
      
    }

  ngOnInit(): void {
    this.route.params.subscribe(chatroomId => {
      this.getChatRoom(chatroomId);
    });
  }

  getChatRoom(chatroomId) {
    let chatId = chatroomId['id'];
    this.currentChat = this.chatService.chats.filter(a => a.id == chatId);
    this.currentChatMembers = this.currentChat[0]['otherUsers'];
    
  }

}
