import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialog-components/dialog-add-channel/dialog-add-channel.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'; //Tobi added Firestore version 8
import { doc, docData, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
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
  db = getFirestore();
  currentUser = JSON.parse(localStorage.getItem('user'));
  // currentUserChats = query(collection(this.db, 'chats'), where('userIds', 'array-contains', this.currentUser.uid));
  // channels: any = [];
  _lastUserVisits: any;

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public chatService: ChatService,
    public channelService: ChannelService,
    public auth: AuthService,
    public toggler: DrawerTogglerService,
  ) {
    
   }

   ngOnInit(): void {
    this.chatService.getChats();
    this.channelService.getChannels();
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'add-channel',
    });
  }
}
