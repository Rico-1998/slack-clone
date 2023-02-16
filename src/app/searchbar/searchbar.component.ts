import { Component, OnInit, HostListener } from '@angular/core';
import { Firestore, limit, onSnapshot, orderBy } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { collection, getDocs, getFirestore, query } from '@firebase/firestore';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { DrawerTogglerService } from '../services/drawer-toggler.service';
import { ChannelService } from '../services/channel.service';
import { DeleteDialogService } from '../services/delete-dialog.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  allUsers = [];
  db: any = getFirestore();
  colref: any = collection(this.db, 'users');
  sortedUser: any = query(this.colref, orderBy('name'), limit(5));
  value: any = '';
  currentFilteredMessages = [];

  constructor(
    public chatService: ChatService,
    public channelService: ChannelService,
    public dialog: MatDialog,
    public userService: UserService,
    public toggler: DrawerTogglerService,    
    public deleteDialogService: DeleteDialogService) { }

    showToggleBtn: boolean = false;

  ngOnInit(): void {    
    let data = [];
    onSnapshot(this.colref, ((snapshot) => {
      snapshot.docs.forEach((doc) => {
        data.push(doc.data());
      })
      for (let i = 0; i < data.length; i++) {
        if (data[i].userName !== 'guest') {
          this.allUsers.push(data[i]);
        }
      }
    }),
    (error) => {
      console.warn('Loading user error', error)
    });
    this.searchInput();
  }

  
  openSettings() {
    this.dialog.open(UserSettingsComponent, { panelClass: 'custom-dialog-container' })
  }


  searchInput() {
      if(this.chatService.currentChat) {
        if(this.value == '') {
          this.chatService.currentFilteredMessages = this.chatService.currentChatMessages;       
          this.value = undefined;
        } else {
          this.chatService.currentFilteredMessages = this.chatService.currentChatMessages.filter(a => a.msg.replace(/<[^>]+>/g, '').toLowerCase().includes(this.value.toLowerCase()));
        }
      } else if (this.channelService.currentChannel) {
        if(this.value == '') {
          this.channelService.currentFilteredMessages = this.channelService.allMessages;   
          this.value = undefined;
        } else {
          this.channelService.currentFilteredMessages = this.channelService.allMessages.filter(a => a.msg.replace(/<[^>]+>/g, '').toLowerCase().includes(this.value.toLowerCase()));
        }
      }
  }
}
