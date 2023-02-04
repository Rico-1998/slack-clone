import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy } from '@angular/fire/firestore';
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
  chatId: any;


  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService,
    public service: FirestoreService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.route.params.subscribe(chatroomId => {
        this.getChatRoom(chatroomId);
      });
    }, 1500);
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getChatRoom(chatroomId) {
    this.chatId = chatroomId['id'];
    this.chatService.currentChat = this.chatService.chats.filter(a => a.id == this.chatId);
    console.log(this.chatService.currentChat);
    this.chatService.currentChatMembers = this.chatService.currentChat[0]?.otherUsers;
    let colRef = query(collection(this.chatService.db, 'chats', this.chatId, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(colRef, async (snapshot) => {
      if (this.chatId != this.chatService.currentChat[0]?.id) {
        unsub();
      } else {
        await this.snapChatroomMessages(chatroomId, snapshot);
      }
    });
  }

  async snapChatroomMessages(chatroomId, snapshot) {
    this.chatService.currentChatMessages = [];
    snapshot.docs.forEach(async (document) => {
      let comments = (await getDocs(collection(this.chatService.db, 'chats', chatroomId['id'], 'messages', document.id, 'comments')));
      let timestampConvertedMsg = { ...(document.data() as object), id: chatroomId['id'], documentId: document.id, comments: comments.size };
      timestampConvertedMsg['timestamp'] = this.channelService.convertTimestamp(timestampConvertedMsg['timestamp'], 'full');
      this.chatService.currentChatMessages.push(timestampConvertedMsg);
      this.chatService.shouldScroll = true;
    });
  }

  scrollToBottom(): void {
    if (this.chatService.shouldScroll) {
      setTimeout(() => {
        this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      });
      setTimeout(() => {
        this.chatService.shouldScroll = false;
      }, 100);
    }
  }

  async deleteMessage(message: any) {
    let actualMsg = doc(this.chatService.db, 'chats', message.id, 'messages', message.documentId);
    await deleteDoc(actualMsg);
    this.getChatRoom(this.chatId);
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
