import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { deleteDoc, deleteField, doc, docData, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { collection, getFirestore, onSnapshot, setDoc } from '@firebase/firestore';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { Observable } from 'rxjs';
import { ChannelService } from '../services/channel.service';





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
    public auth: AuthService,
    public toggler: DrawerTogglerService,
  ) {

  }

  async ngOnInit() {
    if(this.chatService.chats.length == 0) {
      await this.chatService.getChats();
    }
    await this.channelService.getChannels();    
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'add-channel',
    });
  }

  // async deleteChat(chat: any) {
  //   console.log('selected chat',chat);
  //   this.chatService.currentChatMessages.forEach(async (message) => {
  //     let actualChatMessages = doc(this.chatService.db, 'chats', chat.id, 'messages',message.documentId);
  //     await deleteDoc(actualChatMessages);
  //   });
    
  //   let actualChat = doc(this.chatService.db, 'chats', chat.id);    
  //   await deleteDoc(actualChat);
  // }

  deleteChat() {
    console.log('delete');    
  }
}
