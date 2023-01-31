import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../dialog-components/dialog-error/dialog-error.component';
import { DialogSuccessMessageComponent } from '../dialog-components/dialog-success-message/dialog-success-message.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../services/auth.service';
import { ChannelService } from '../services/channel.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  openLogin() {
    this.dialog.open(LoginComponent);
  }

  openSignUp() {
    this.dialog.open(RegisterComponent);
  }


}
