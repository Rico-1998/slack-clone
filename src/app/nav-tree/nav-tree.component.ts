import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { ChannelService } from '../services/channel.service';
import { deleteDoc, doc } from '@firebase/firestore';





@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss']
})
export class NavTreeComponent implements OnInit {
  openChannelPanel = true;
  openChatsPanel = true;
  currentUser = JSON.parse(localStorage.getItem('user'));
  _lastUserVisits: any;
  hover: any = [];

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public chatService: ChatService,
    public channelService: ChannelService,
    public authService: AuthService,
    public toggler: DrawerTogglerService,
  ) {
  }

  async ngOnInit() {
    if (this.chatService.chats.length == 0) {
      await this.chatService.getChats();
    }
    await this.channelService.getChannels();
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'add-channel',
    });
  }


  async deleteChat(chat: any) {
    console.log('selected chat', chat);
    let msgs = [];
    this.chatService.currentChatMessages.forEach(async (message) => {
      let actualChatMessages = doc(this.chatService.db, 'chats', chat.id, 'messages', message.documentId);
      msgs.push(actualChatMessages)
    });
    let actualChat = doc(this.chatService.db, 'chats', chat.id);
    await deleteDoc(actualChat);
  }


  status(chat) {
    let status = false;
    this.userService.users.forEach(user => {
      if (user.id == chat.otherUsers[0]['id'] && user.loggedIn) {
        status = true;
      }
    });
    return status;
  }
}
