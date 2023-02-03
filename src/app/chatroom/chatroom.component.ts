import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy} from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { FirestoreService } from '../services/firestore.service';



@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  textBoxPath: string = 'chatroom';
  textBoxPathEdit: string = 'edit';
  @ViewChild('scrollBox') private scrollBox: ElementRef;
  hover: boolean = false;


  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService,
    public service: FirestoreService,
  ) { 
  }

  async ngOnInit() {
   
    setTimeout(() => {
      this.route.params.subscribe(async chatroomId => {
        if (this.chatService.chatId) {
          await this.chatService.updateLastVisitTimestamp()
        }
        this.chatService.getChatRoom(chatroomId);
        this.chatService.updateLastVisitTimestamp();
      });
    }, 1500);
    this.scrollToBottom();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if(this.chatService.shouldScroll) {
      setTimeout(() => {
        this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      });
      setTimeout(() => {
        this.chatService.shouldScroll = false;
      }, 100);
    }
  }

  async deleteMessage(message: any) {
    let actualMsg = doc(this.chatService.db, 'chats', message.id.id, 'messages', message.documentId);
    await deleteDoc(actualMsg);
  }
  
  openThread(message) {
    this.chatService.thread = message;
    this.chatService.threadOpen = true;
    this.chatService.getCurrentThread();
    this.chatService.loadMessageToThread();
  }

  changePath(message) {
    this.chatService.msgToEdit = message;
  }

  

}
