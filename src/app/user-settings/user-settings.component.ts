import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
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
    public dialogRef: MatDialogRef<UserSettingsComponent>,) { }

  ngOnInit(): void {
  }

  logout() {
    this.dialogRef.close()
    this.auth.logout();
  }

}
