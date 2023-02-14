import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deleteDoc, doc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { DeleteDialogService } from '../services/delete-dialog.service';




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
    public deleteDialogService: DeleteDialogService,
  ) {
  }

  async ngOnInit() {
    this.handleComponentChange();
    let timeout = setInterval(() => {
      if (this.chatService.chats.length > 0) {
        clearInterval(timeout);
        this.route.params.subscribe(async chatroomId => {
          this.handleComponentChange();
          if (this.chatService.chatId) {
            await this.chatService.updateLastVisitTimestamp();
            this.chatService.destroy();
          }
          this.chatService.getChatRoom(chatroomId);
          this.chatService.updateLastVisitTimestamp();
        });
      }
    }, 500)
    this.scrollToBottom();
  }

  
  handleComponentChange() {
    this.chatService.chatLoading = true;
    this.chatService.threadOpen = false
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  //**scrolls to last message of current chat if necessary*/
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


  //**delete message in server collection */
  async deleteMessage(message: any) {
    let actualMsg = doc(this.chatService.db, 'chats', message.id, 'messages', message.documentId);
    await deleteDoc(actualMsg);
  }
}
