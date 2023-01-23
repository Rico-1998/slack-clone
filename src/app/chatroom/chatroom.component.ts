import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { collection, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc } from '@firebase/firestore';
import { ChatService } from '../services/chat.service';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';


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
    public userService: UserService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.route.params.subscribe(chatroomId => {
        this.chatService.getChatRoom(chatroomId);
      });
      this.scrollToBottom();
    }, 1500);

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
  }

  async deleteMessage(message: any) {
    let actualMsg = doc(this.chatService.db, 'chats', message.id.id, 'messages', message.documentId);
    await deleteDoc(actualMsg);
  }

  openThread(message) {
    this.chatService.thread = message;
    this.chatService.threadOpen = true;
    this.chatService.getCurrentThread();
  }

}
