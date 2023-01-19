import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  // currentchatMessages = [];
  textBoxPath: string = 'chatroom';
  @ViewChild('scrollBox') private scrollBox: ElementRef;


  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(chatroomId => {
      this.chatService.getChatRoom(chatroomId);
    });
    this.scrollToBottom();        
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 
  
  scrollToBottom(): void {
   this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;                
  }

}
