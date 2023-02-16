import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getFirestore } from '@firebase/firestore';
import { ChannelService } from '../services/channel.service';
import { Message } from 'src/modules/messages.class';
import { UserService } from '../services/user.service';
import { DeleteDialogService } from '../services/delete-dialog.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})

export class ChannelsComponent implements OnInit {
  @ViewChild('scrollBox') private scrollBox: ElementRef;
  db = getFirestore();
  public displayEditMenu;
  messageToEdit: any;
  channelId: any;
  currentMessage: any;
  currentUserName: any;
  currentChannelRoom: any;
  lastMessage: any;
  newMessage: Message;
  showBtn: boolean = false;
  messageEditable: boolean = false;
  textBoxPath: string = 'channels';
  textBoxPathEdit: string = 'edit-channel';

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public chatService: ChatService,
    public router: Router,
    public deleteDialogService: DeleteDialogService,
  ) {
    route.params.subscribe((channelRoomId) => {
      if (this.channelService.channelId) {
        this.channelService.updateLastVisitTimestamp();
      }
      this.channelService.channelId = channelRoomId['id'];
    });
  }


  async ngOnInit() {
    this.route.params.subscribe(async (channelRoomId) => {
      this.handleComponentChange();
      this.channelService.destroy();
      //Checkes if we alredy visited a channel and updates the lastVisitTimestamp
      if (this.channelService.channelId) {
        await this.channelService.updateLastVisitTimestamp();
      }
      this.channelService.getChannelRoom(channelRoomId);
    })
    this.channelService.updateLastVisitTimestamp()
    this.userService.channelEditor = true;
    this.userService.chatEditor = false;
    this.scrollToBottom();
  }


  //**handles component change */
  handleComponentChange() {
    this.channelService.channelLoading = true;
    this.channelService.threadOpen = false;
  }


  //**triggers scroll to bottom */
  ngAfterViewChecked() {
    this.scrollToBottom();

  }


  //**scrolls to bottom */
  scrollToBottom(): void {
    if (this.channelService.shouldScroll) {
      setTimeout(() => {
        this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      });
      setTimeout(() => {
        this.channelService.shouldScroll = false;
      }, 100);
    }
  }


  //**Changes the path to identify the message to edit */
  changePath(message) {
    this.channelService.msgToEdit = message;
    setTimeout(() => {
      let quillEditorTextfield = document.querySelectorAll('.ql-editor');
      quillEditorTextfield[0].innerHTML = message.msg;
      quillEditorTextfield
    });
  }
}