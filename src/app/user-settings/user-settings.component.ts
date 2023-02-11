import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ChannelService } from '../services/channel.service';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  cur
  constructor(public userService: UserService,
    public auth: AuthService,
    public dialogRef: MatDialogRef<UserSettingsComponent>,
    public chatService: ChatService,
    public channelService: ChannelService) { }

  ngOnInit(): void {
  }

  logout(currentUser) {
    this.dialogRef.close()
    this.channelService.threadOpen = false;
    this.chatService.threadOpen = false;
    this.auth.logout(currentUser);
    this.auth.loggedIn = false;
  }

}
